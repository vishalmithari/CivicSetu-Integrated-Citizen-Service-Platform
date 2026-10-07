package com.mahaseva.mahasevacore.service;

import com.mahaseva.mahasevacore.dto.DocumentActionRequestDTO;
import com.mahaseva.mahasevacore.dto.OfficerStatsDTO;
import com.mahaseva.mahasevacore.dto.UpdateStatusRequestDTO;
import com.mahaseva.mahasevacore.entity.*;
import com.mahaseva.mahasevacore.repository.ApplicationRepository;
import com.mahaseva.mahasevacore.repository.DocumentRepository;
import com.mahaseva.mahasevacore.repository.NotificationRepository;
import com.mahaseva.mahasevacore.repository.UserRepository;
import com.mahaseva.mahasevacore.security.UserPrincipal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class OfficerService {

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DocumentRepository documentRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private AuditService auditService;

    private User getOfficer() {
        UserPrincipal userPrincipal = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return userRepository.findById(userPrincipal.getId())
                .orElseThrow(() -> new RuntimeException("Officer not found"));
    }

    private boolean isSuperAdmin(User user) {
        return user.getRoles().contains(Role.ROLE_SUPER_ADMIN);
    }

    public OfficerStatsDTO getDashboardStats() {
        User officer = getOfficer();
        List<Application> apps = isSuperAdmin(officer) ? applicationRepository.findAll() : applicationRepository.findByDepartmentId(officer.getDepartmentId());

        OfficerStatsDTO stats = new OfficerStatsDTO();
        stats.setTotalAssigned(apps.size());
        stats.setPendingReview(apps.stream().filter(a -> a.getStatus() == ApplicationStatus.SUBMITTED).count());
        stats.setDocumentVerification(apps.stream().filter(a -> a.getStatus() == ApplicationStatus.DOCUMENT_VERIFICATION).count());
        stats.setCorrectionRequired(apps.stream().filter(a -> a.getStatus() == ApplicationStatus.CORRECTION_REQUIRED).count());
        stats.setApproved(apps.stream().filter(a -> a.getStatus() == ApplicationStatus.APPROVED).count());
        stats.setRejected(apps.stream().filter(a -> a.getStatus() == ApplicationStatus.REJECTED).count());
        stats.setCompleted(apps.stream().filter(a -> a.getStatus() == ApplicationStatus.COMPLETED).count());

        Map<String, Long> byStatus = apps.stream().collect(Collectors.groupingBy(a -> a.getStatus().name(), Collectors.counting()));
        Map<String, Long> byService = apps.stream().collect(Collectors.groupingBy(Application::getServiceName, Collectors.counting()));
        
        stats.setApplicationsByStatus(byStatus);
        stats.setApplicationsByService(byService);

        return stats;
    }

    public List<Application> getApplications() {
        User officer = getOfficer();
        return isSuperAdmin(officer) ? applicationRepository.findAll() : applicationRepository.findByDepartmentId(officer.getDepartmentId());
    }

    public Application getApplicationDetails(String applicationId) {
        User officer = getOfficer();
        Application app = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        if (!isSuperAdmin(officer) && !officer.getDepartmentId().equals(app.getDepartmentId())) {
            throw new RuntimeException("Unauthorized: Application belongs to another department");
        }
        
        auditService.logAction(officer.getId(), "OFFICER", "VIEW_APPLICATION", "Application", applicationId, "Viewed application details");
        return app;
    }

    public Application updateApplicationStatus(String applicationId, UpdateStatusRequestDTO request) {
        User officer = getOfficer();
        Application app = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        if (!isSuperAdmin(officer) && !officer.getDepartmentId().equals(app.getDepartmentId())) {
            throw new RuntimeException("Unauthorized: Application belongs to another department");
        }

        // Validate state transitions
        ApplicationStatus current = app.getStatus();
        ApplicationStatus next = request.getStatus();
        
        boolean valid = false;
        if (current == ApplicationStatus.SUBMITTED && next == ApplicationStatus.DOCUMENT_VERIFICATION) valid = true;
        if (current == ApplicationStatus.DOCUMENT_VERIFICATION && (next == ApplicationStatus.UNDER_REVIEW || next == ApplicationStatus.CORRECTION_REQUIRED)) valid = true;
        if (current == ApplicationStatus.CORRECTION_REQUIRED && next == ApplicationStatus.DOCUMENT_VERIFICATION) valid = true; // Wait, citizen handles submit back to doc ver
        if (current == ApplicationStatus.UNDER_REVIEW && (next == ApplicationStatus.APPROVED || next == ApplicationStatus.REJECTED)) valid = true;
        if (current == ApplicationStatus.APPROVED && next == ApplicationStatus.COMPLETED) valid = true;
        
        // Let officer jump to reject/correction from anywhere
        if (next == ApplicationStatus.REJECTED || next == ApplicationStatus.CORRECTION_REQUIRED) valid = true;

        if (!valid) {
            throw new RuntimeException("Invalid status transition from " + current + " to " + next);
        }

        if ((next == ApplicationStatus.REJECTED || next == ApplicationStatus.CORRECTION_REQUIRED) && (request.getRemarks() == null || request.getRemarks().isBlank())) {
            throw new RuntimeException("Remarks are required for " + next);
        }

        app.setStatus(next);
        app.setRemarks(request.getRemarks());
        app.setAssignedOfficer(officer.getFirstName() + " " + officer.getLastName());
        app.setAssignedOfficerId(officer.getId());
        app.setUpdatedAt(LocalDateTime.now());
        
        Application savedApp = applicationRepository.save(app);

        // Notify Citizen
        String msg = "Your application " + app.getApplicationNumber() + " status is now " + next + (request.getRemarks() != null ? " (" + request.getRemarks() + ")" : "");
        notificationRepository.save(new Notification(app.getCitizenId(), "Application Status Updated", msg, app.getId()));
        
        auditService.logAction(officer.getId(), "OFFICER", "UPDATE_STATUS", "Application", applicationId, "Changed status to " + next);

        return savedApp;
    }

    public DocumentRecord processDocumentAction(String documentId, DocumentActionRequestDTO request) {
        User officer = getOfficer();
        DocumentRecord doc = documentRepository.findById(documentId)
                .orElseThrow(() -> new RuntimeException("Document not found"));

        Application app = applicationRepository.findById(doc.getApplicationId())
                .orElseThrow(() -> new RuntimeException("Application not found"));

        if (!isSuperAdmin(officer) && !officer.getDepartmentId().equals(app.getDepartmentId())) {
            throw new RuntimeException("Unauthorized: Application belongs to another department");
        }

        if (("REJECTED".equals(request.getAction()) || "CORRECTION_REQUIRED".equals(request.getAction())) && 
            (request.getRemarks() == null || request.getRemarks().isBlank())) {
            throw new RuntimeException("Remarks are required for rejection or correction.");
        }

        DocumentStatus docStatus;
        switch (request.getAction()) {
            case "VERIFY": docStatus = DocumentStatus.VERIFIED; break;
            case "REJECT": docStatus = DocumentStatus.REJECTED; break;
            case "CORRECTION_REQUIRED": docStatus = DocumentStatus.CORRECTION_REQUIRED; break;
            default: throw new RuntimeException("Invalid action");
        }

        doc.setStatus(docStatus);
        doc.setRemarks(request.getRemarks());
        doc.setVerifiedBy(officer.getId());
        doc.setVerifiedAt(LocalDateTime.now());
        
        DocumentRecord savedDoc = documentRepository.save(doc);

        String msg = "Document '" + doc.getDocumentType() + "' for application " + app.getApplicationNumber() + " was marked as " + docStatus;
        notificationRepository.save(new Notification(app.getCitizenId(), "Document Verification", msg, app.getId()));
        
        auditService.logAction(officer.getId(), "OFFICER", "DOCUMENT_ACTION", "Document", documentId, "Action: " + docStatus);

        return savedDoc;
    }
}
