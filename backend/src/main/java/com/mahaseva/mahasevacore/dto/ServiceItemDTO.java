package com.mahaseva.mahasevacore.dto;

import java.util.List;

public class ServiceItemDTO {
    private String id;
    private String name;
    private DepartmentDTO department;
    private String description;
    private String eligibility;
    private List<String> requiredDocuments;
    private String processingTime;
    private Double fee;
    private String applicationProcess;
    private String lastUpdated;
    private boolean active;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public DepartmentDTO getDepartment() { return department; }
    public void setDepartment(DepartmentDTO department) { this.department = department; }
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
    public String getLastUpdated() { return lastUpdated; }
    public void setLastUpdated(String lastUpdated) { this.lastUpdated = lastUpdated; }
    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }
}
