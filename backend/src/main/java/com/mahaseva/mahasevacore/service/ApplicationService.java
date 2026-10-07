package com.mahaseva.mahasevacore.service;

import com.mahaseva.mahasevacore.dto.ApplicationRequestDTO;
import com.mahaseva.mahasevacore.dto.ApplicationResponseDTO;
import com.mahaseva.mahasevacore.entity.Application;
import com.mahaseva.mahasevacore.entity.ApplicationStatus;
import com.mahaseva.mahasevacore.entity.Notification;
import com.mahaseva.mahasevacore.entity.ServiceItem;
import com.mahaseva.mahasevacore.repository.ApplicationRepository;
import com.mahaseva.mahasevacore.repository.NotificationRepository;
import com.mahaseva.mahasevacore.repository.ServiceItemRepository;
import com.mahaseva.mahasevacore.security.UserPrincipal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ApplicationService {

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private ServiceItemRepository serviceItemRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private com.mahaseva.mahasevacore.repository.UserRepository userRepository;

    private UserPrincipal getCurrentUser() {
        return (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }

    private String generateApplicationNumber() {
        long count = applicationRepository.count();
        return String.format("MS-2026-%06d", count + 1);
    }

    public ApplicationResponseDTO createApplication(ApplicationRequestDTO request) {
        UserPrincipal user = getCurrentUser();
        ServiceItem serviceItem = serviceItemRepository.findById(request.getServiceId())
                .orElseThrow(() -> new RuntimeException("Service not found"));

        Application app = new Application();
        app.setApplicationNumber(generateApplicationNumber());
        app.setServiceId(serviceItem.getId());
        app.setServiceName(serviceItem.getName());
        app.setDepartmentId(serviceItem.getDepartment() != null ? serviceItem.getDepartment().getId() : null);
        app.setDepartmentName(serviceItem.getDepartment() != null ? serviceItem.getDepartment().getName() : "General");
        app.setCitizenId(user.getId());
        app.setCitizenName(user.getUsername()); // or get full name if available
        app.setFormData(request.getFormData());
        app.setDocuments(request.getDocuments());
        app.setCreatedAt(LocalDateTime.now());
        app.setUpdatedAt(LocalDateTime.now());
        
        if (request.isSubmit()) {
            app.setStatus(ApplicationStatus.SUBMITTED);
            app.setSubmittedAt(LocalDateTime.now());
        } else {
            app.setStatus(ApplicationStatus.DRAFT);
        }

        Application savedApp = applicationRepository.save(app);

        if (request.isSubmit()) {
            String msg = "Your " + savedApp.getServiceName() + " application " + savedApp.getApplicationNumber() + " has been submitted successfully.";
            notificationRepository.save(new Notification(user.getId(), "Application Submitted", msg, savedApp.getId()));
            
            if (savedApp.getDepartmentId() != null) {
                userRepository.findByDepartmentId(savedApp.getDepartmentId()).stream()
                    .filter(u -> u.getRoles().contains(com.mahaseva.mahasevacore.entity.Role.ROLE_OFFICER) || u.getRoles().contains(com.mahaseva.mahasevacore.entity.Role.ROLE_DEPT_ADMIN))
                    .forEach(u -> notificationRepository.save(new Notification(u.getId(), "New Application", "New application " + savedApp.getApplicationNumber() + " is available for review.", savedApp.getId())));
            }
        }

        return mapToDTO(savedApp);
    }

    public ApplicationResponseDTO updateApplication(String id, ApplicationRequestDTO request) {
        UserPrincipal user = getCurrentUser();
        Application app = applicationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        if (!app.getCitizenId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized");
        }

        if (app.getStatus() != ApplicationStatus.DRAFT && app.getStatus() != ApplicationStatus.CORRECTION_REQUIRED) {
            throw new RuntimeException("Cannot edit application in current status");
        }

        app.setFormData(request.getFormData());
        app.setDocuments(request.getDocuments());
        app.setUpdatedAt(LocalDateTime.now());

        if (request.isSubmit()) {
            app.setStatus(ApplicationStatus.SUBMITTED);
            if (app.getSubmittedAt() == null) {
                app.setSubmittedAt(LocalDateTime.now());
            }
            String msg = "Your " + app.getServiceName() + " application " + app.getApplicationNumber() + " has been resubmitted successfully.";
            notificationRepository.save(new Notification(user.getId(), "Application Resubmitted", msg, app.getId()));
            
            if (app.getAssignedOfficerId() != null) {
                notificationRepository.save(new Notification(app.getAssignedOfficerId(), "Application Resubmitted", "Application " + app.getApplicationNumber() + " has been resubmitted after correction.", app.getId()));
            }
        }

        return mapToDTO(applicationRepository.save(app));
    }

    public List<ApplicationResponseDTO> getMyApplications() {
        UserPrincipal user = getCurrentUser();
        return applicationRepository.findByCitizenId(user.getId()).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public ApplicationResponseDTO getApplicationById(String id) {
        UserPrincipal user = getCurrentUser();
        Application app = applicationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        if (!app.getCitizenId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized");
        }

        return mapToDTO(app);
    }

    public void deleteApplication(String id) {
        UserPrincipal user = getCurrentUser();
        Application app = applicationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        if (!app.getCitizenId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized");
        }

        if (app.getStatus() != ApplicationStatus.DRAFT) {
            throw new RuntimeException("Only drafts can be deleted");
        }

        applicationRepository.delete(app);
    }

    private ApplicationResponseDTO mapToDTO(Application app) {
        ApplicationResponseDTO dto = new ApplicationResponseDTO();
        dto.setId(app.getId());
        dto.setApplicationNumber(app.getApplicationNumber());
        dto.setServiceId(app.getServiceId());
        dto.setServiceName(app.getServiceName());
        dto.setDepartmentName(app.getDepartmentName());
        dto.setStatus(app.getStatus());
        dto.setFormData(app.getFormData());
        dto.setRemarks(app.getRemarks());
        dto.setAssignedOfficer(app.getAssignedOfficer());
        dto.setSubmittedAt(app.getSubmittedAt());
        dto.setUpdatedAt(app.getUpdatedAt());
        return dto;
    }
}
