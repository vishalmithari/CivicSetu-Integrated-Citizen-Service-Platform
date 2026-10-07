package com.mahaseva.mahasevacore.service;

import com.mahaseva.mahasevacore.dto.AdminStatsDTO;
import com.mahaseva.mahasevacore.entity.*;
import com.mahaseva.mahasevacore.repository.ApplicationRepository;
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
public class AdminService {

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private AuditService auditService;

    private User getAdmin() {
        UserPrincipal userPrincipal = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return userRepository.findById(userPrincipal.getId())
                .orElseThrow(() -> new RuntimeException("Admin not found"));
    }

    private boolean isSuperAdmin(User user) {
        return user.getRoles().contains(Role.ROLE_SUPER_ADMIN);
    }

    public AdminStatsDTO getDashboardStats() {
        User admin = getAdmin();
        List<Application> apps = isSuperAdmin(admin) ? 
            applicationRepository.findAll() : 
            applicationRepository.findByDepartmentId(admin.getDepartmentId());
            
        List<User> officers = (isSuperAdmin(admin) ? userRepository.findAll() : userRepository.findByDepartmentId(admin.getDepartmentId()))
            .stream().filter(u -> u.getRoles().contains(Role.ROLE_OFFICER)).collect(Collectors.toList());

        AdminStatsDTO stats = new AdminStatsDTO();
        stats.setTotalApplications(apps.size());
        stats.setPendingReview(apps.stream().filter(a -> a.getStatus() == ApplicationStatus.SUBMITTED).count());
        stats.setDocumentVerification(apps.stream().filter(a -> a.getStatus() == ApplicationStatus.DOCUMENT_VERIFICATION).count());
        stats.setCorrectionRequired(apps.stream().filter(a -> a.getStatus() == ApplicationStatus.CORRECTION_REQUIRED).count());
        stats.setApproved(apps.stream().filter(a -> a.getStatus() == ApplicationStatus.APPROVED).count());
        stats.setRejected(apps.stream().filter(a -> a.getStatus() == ApplicationStatus.REJECTED).count());
        stats.setCompleted(apps.stream().filter(a -> a.getStatus() == ApplicationStatus.COMPLETED).count());
        stats.setTotalOfficers(officers.size());

        Map<String, Long> byStatus = apps.stream().collect(Collectors.groupingBy(a -> a.getStatus().name(), Collectors.counting()));
        Map<String, Long> byService = apps.stream().collect(Collectors.groupingBy(Application::getServiceName, Collectors.counting()));
        
        stats.setApplicationsByStatus(byStatus);
        stats.setApplicationsByService(byService);

        return stats;
    }

    public List<Application> getApplications() {
        User admin = getAdmin();
        return isSuperAdmin(admin) ? 
            applicationRepository.findAll() : 
            applicationRepository.findByDepartmentId(admin.getDepartmentId());
    }

    public Application getApplicationDetails(String applicationId) {
        User admin = getAdmin();
        Application app = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        if (!isSuperAdmin(admin) && !admin.getDepartmentId().equals(app.getDepartmentId())) {
            throw new RuntimeException("Unauthorized: Application belongs to another department");
        }
        
        auditService.logAction(admin.getId(), "DEPARTMENT_ADMIN", "VIEW_APPLICATION", "Application", applicationId, "Viewed application details");
        return app;
    }

    public List<User> getOfficers() {
        User admin = getAdmin();
        return (isSuperAdmin(admin) ? userRepository.findAll() : userRepository.findByDepartmentId(admin.getDepartmentId()))
            .stream().filter(u -> u.getRoles().contains(Role.ROLE_OFFICER)).collect(Collectors.toList());
    }

    public Application assignApplication(String applicationId, String officerId) {
        User admin = getAdmin();
        Application app = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        if (!isSuperAdmin(admin) && !admin.getDepartmentId().equals(app.getDepartmentId())) {
            throw new RuntimeException("Unauthorized: Application belongs to another department");
        }

        User officer = userRepository.findById(officerId)
                .orElseThrow(() -> new RuntimeException("Officer not found"));

        if (!officer.getRoles().contains(Role.ROLE_OFFICER)) {
            throw new RuntimeException("Selected user is not an officer");
        }

        if (!isSuperAdmin(admin) && !admin.getDepartmentId().equals(officer.getDepartmentId())) {
            throw new RuntimeException("Unauthorized: Officer belongs to another department");
        }

        app.setAssignedOfficer(officer.getFirstName() + " " + officer.getLastName());
        app.setAssignedOfficerId(officer.getId());
        app.setUpdatedAt(LocalDateTime.now());
        Application savedApp = applicationRepository.save(app);

        auditService.logAction(admin.getId(), "DEPARTMENT_ADMIN", "ASSIGN_APPLICATION", "Application", applicationId, "Assigned to officer: " + officer.getUsername());
        
        return savedApp;
    }

    @Autowired
    private com.mahaseva.mahasevacore.repository.ServiceItemRepository serviceItemRepository;

    public ServiceItem updateServiceStatus(String serviceId, boolean active) {
        User admin = getAdmin();
        ServiceItem service = serviceItemRepository.findById(serviceId)
                .orElseThrow(() -> new RuntimeException("Service not found"));

        if (!isSuperAdmin(admin) && !admin.getDepartmentId().equals(service.getDepartment().getId())) {
            throw new RuntimeException("Unauthorized: Service belongs to another department");
        }

        service.setActive(active);
        service.setUpdatedAt(LocalDateTime.now());
        ServiceItem savedService = serviceItemRepository.save(service);
        
        auditService.logAction(admin.getId(), "DEPARTMENT_ADMIN", "UPDATE_SERVICE_STATUS", "ServiceItem", serviceId, "Service status changed to " + active);
        
        return savedService;
    }

    public AdminStatsDTO getReports(String startDate, String endDate) {
        User admin = getAdmin();
        List<Application> allApps = isSuperAdmin(admin) ? 
            applicationRepository.findAll() : 
            applicationRepository.findByDepartmentId(admin.getDepartmentId());
            
        LocalDateTime start = (startDate != null && !startDate.isBlank()) ? LocalDateTime.parse(startDate + "T00:00:00") : null;
        LocalDateTime end = (endDate != null && !endDate.isBlank()) ? LocalDateTime.parse(endDate + "T23:59:59") : null;
        
        List<Application> apps = allApps.stream()
            .filter(a -> start == null || a.getCreatedAt() != null && (a.getCreatedAt().isAfter(start) || a.getCreatedAt().isEqual(start)))
            .filter(a -> end == null || a.getCreatedAt() != null && (a.getCreatedAt().isBefore(end) || a.getCreatedAt().isEqual(end)))
            .collect(Collectors.toList());

        List<User> officers = (isSuperAdmin(admin) ? userRepository.findAll() : userRepository.findByDepartmentId(admin.getDepartmentId()))
            .stream().filter(u -> u.getRoles().contains(Role.ROLE_OFFICER)).collect(Collectors.toList());

        AdminStatsDTO stats = new AdminStatsDTO();
        stats.setTotalApplications(apps.size());
        stats.setPendingReview(apps.stream().filter(a -> a.getStatus() == ApplicationStatus.SUBMITTED).count());
        stats.setDocumentVerification(apps.stream().filter(a -> a.getStatus() == ApplicationStatus.DOCUMENT_VERIFICATION).count());
        stats.setCorrectionRequired(apps.stream().filter(a -> a.getStatus() == ApplicationStatus.CORRECTION_REQUIRED).count());
        stats.setApproved(apps.stream().filter(a -> a.getStatus() == ApplicationStatus.APPROVED).count());
        stats.setRejected(apps.stream().filter(a -> a.getStatus() == ApplicationStatus.REJECTED).count());
        stats.setCompleted(apps.stream().filter(a -> a.getStatus() == ApplicationStatus.COMPLETED).count());
        stats.setTotalOfficers(officers.size());

        Map<String, Long> byStatus = apps.stream().collect(Collectors.groupingBy(a -> a.getStatus().name(), Collectors.counting()));
        Map<String, Long> byService = apps.stream().collect(Collectors.groupingBy(a -> a.getServiceName() != null ? a.getServiceName() : "Unknown", Collectors.counting()));
        Map<String, Long> byDept = apps.stream().collect(Collectors.groupingBy(a -> a.getDepartmentName() != null ? a.getDepartmentName() : "General", Collectors.counting()));
        Map<String, Long> byOfficer = apps.stream().filter(a -> a.getAssignedOfficer() != null).collect(Collectors.groupingBy(Application::getAssignedOfficer, Collectors.counting()));
        
        stats.setApplicationsByStatus(byStatus);
        stats.setApplicationsByService(byService);
        stats.setApplicationsByDepartment(byDept);
        stats.setOfficerWorkload(byOfficer);

        return stats;
    }
}
