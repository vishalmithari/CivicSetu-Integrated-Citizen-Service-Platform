package com.mahaseva.mahasevacore.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "services")
public class ServiceItem {
    @Id
    private String id;
    private String name;
    
    @DBRef
    private Department department;
    
    private String description;
    private String eligibility;
    private List<String> requiredDocuments;
    private String processingTime;
    private Double fee;
    private String applicationProcess;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private boolean active = true;

    public ServiceItem() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public Department getDepartment() { return department; }
    public void setDepartment(Department department) { this.department = department; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getEligibility() { return eligibility; }
    public void setEligibility(String eligibility) { this.eligibility = eligibility; }
    public List<String> getRequiredDocuments() { return requiredDocuments; }
    public void setRequiredDocuments(List<String> requiredDocuments) { this.requiredDocuments = requiredDocuments; }
    public String getProcessingTime() { return processingTime; }
    public void setProcessingTime(String processingTime) { this.processingTime = processingTime; }
    public Double getFee() { return fee; }
    public void setFee(Double fee) { this.fee = fee; }
    public String getApplicationProcess() { return applicationProcess; }
    public void setApplicationProcess(String applicationProcess) { this.applicationProcess = applicationProcess; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }
}
