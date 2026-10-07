package com.mahaseva.mahasevacore.dto;

import com.mahaseva.mahasevacore.entity.ApplicationStatus;
import java.time.LocalDateTime;
import java.util.Map;

public class ApplicationResponseDTO {
    private String id;
    private String applicationNumber;
    private String serviceId;
    private String serviceName;
    private String departmentName;
    private ApplicationStatus status;
    private Map<String, Object> formData;
    private String remarks;
    private String assignedOfficer;
    private LocalDateTime submittedAt;
    private LocalDateTime updatedAt;

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getApplicationNumber() { return applicationNumber; }
    public void setApplicationNumber(String applicationNumber) { this.applicationNumber = applicationNumber; }
    public String getServiceId() { return serviceId; }
    public void setServiceId(String serviceId) { this.serviceId = serviceId; }
    public String getServiceName() { return serviceName; }
    public void setServiceName(String serviceName) { this.serviceName = serviceName; }
    public String getDepartmentName() { return departmentName; }
    public void setDepartmentName(String departmentName) { this.departmentName = departmentName; }
    public ApplicationStatus getStatus() { return status; }
    public void setStatus(ApplicationStatus status) { this.status = status; }
    public Map<String, Object> getFormData() { return formData; }
    public void setFormData(Map<String, Object> formData) { this.formData = formData; }
    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }
    public String getAssignedOfficer() { return assignedOfficer; }
    public void setAssignedOfficer(String assignedOfficer) { this.assignedOfficer = assignedOfficer; }
    public LocalDateTime getSubmittedAt() { return submittedAt; }
    public void setSubmittedAt(LocalDateTime submittedAt) { this.submittedAt = submittedAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
