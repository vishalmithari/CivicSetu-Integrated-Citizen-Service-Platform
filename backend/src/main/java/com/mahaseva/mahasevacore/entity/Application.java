package com.mahaseva.mahasevacore.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.List;

@Document(collection = "applications")
public class Application {
    @Id
    private String id;
    
    // Human readable ID (e.g. MS-2026-000001)
    private String applicationNumber;
    
    private String serviceId;
    private String serviceName;
    private String departmentId;
    private String departmentName;
    
    private String citizenId;
    private String citizenName;
    
    private ApplicationStatus status;
    
    private Map<String, Object> formData;
    private List<String> documents; // Placeholder for document architecture
    
    private String remarks;
    private String assignedOfficer;
    private String assignedOfficerId;
    
    private LocalDateTime submittedAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public Application() {}

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getApplicationNumber() { return applicationNumber; }
    public void setApplicationNumber(String applicationNumber) { this.applicationNumber = applicationNumber; }
    public String getServiceId() { return serviceId; }
    public void setServiceId(String serviceId) { this.serviceId = serviceId; }
    public String getServiceName() { return serviceName; }
    public void setServiceName(String serviceName) { this.serviceName = serviceName; }
    public String getDepartmentId() { return departmentId; }
    public void setDepartmentId(String departmentId) { this.departmentId = departmentId; }
    public String getDepartmentName() { return departmentName; }
    public void setDepartmentName(String departmentName) { this.departmentName = departmentName; }
    public String getCitizenId() { return citizenId; }
    public void setCitizenId(String citizenId) { this.citizenId = citizenId; }
    public String getCitizenName() { return citizenName; }
    public void setCitizenName(String citizenName) { this.citizenName = citizenName; }
    public ApplicationStatus getStatus() { return status; }
    public void setStatus(ApplicationStatus status) { this.status = status; }
    public Map<String, Object> getFormData() { return formData; }
    public void setFormData(Map<String, Object> formData) { this.formData = formData; }
    public List<String> getDocuments() { return documents; }
    public void setDocuments(List<String> documents) { this.documents = documents; }
    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }
    public String getAssignedOfficer() { return assignedOfficer; }
    public void setAssignedOfficer(String assignedOfficer) { this.assignedOfficer = assignedOfficer; }
    public String getAssignedOfficerId() { return assignedOfficerId; }
    public void setAssignedOfficerId(String assignedOfficerId) { this.assignedOfficerId = assignedOfficerId; }
    public LocalDateTime getSubmittedAt() { return submittedAt; }
    public void setSubmittedAt(LocalDateTime submittedAt) { this.submittedAt = submittedAt; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
