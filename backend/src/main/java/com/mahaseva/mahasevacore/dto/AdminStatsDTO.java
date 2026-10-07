package com.mahaseva.mahasevacore.dto;

import java.util.Map;

public class AdminStatsDTO {
    private long totalApplications;
    private long pendingReview;
    private long documentVerification;
    private long correctionRequired;
    private long approved;
    private long rejected;
    private long completed;
    private long totalOfficers;
    
    private Map<String, Long> applicationsByStatus;
    private Map<String, Long> applicationsByService;

    // Getters and Setters
    public long getTotalApplications() { return totalApplications; }
    public void setTotalApplications(long totalApplications) { this.totalApplications = totalApplications; }
    public long getPendingReview() { return pendingReview; }
    public void setPendingReview(long pendingReview) { this.pendingReview = pendingReview; }
    public long getDocumentVerification() { return documentVerification; }
    public void setDocumentVerification(long documentVerification) { this.documentVerification = documentVerification; }
    public long getCorrectionRequired() { return correctionRequired; }
    public void setCorrectionRequired(long correctionRequired) { this.correctionRequired = correctionRequired; }
    public long getApproved() { return approved; }
    public void setApproved(long approved) { this.approved = approved; }
    public long getRejected() { return rejected; }
    public void setRejected(long rejected) { this.rejected = rejected; }
    public long getCompleted() { return completed; }
    public void setCompleted(long completed) { this.completed = completed; }
    public long getTotalOfficers() { return totalOfficers; }
    public void setTotalOfficers(long totalOfficers) { this.totalOfficers = totalOfficers; }
    public Map<String, Long> getApplicationsByStatus() { return applicationsByStatus; }
    public void setApplicationsByStatus(Map<String, Long> applicationsByStatus) { this.applicationsByStatus = applicationsByStatus; }
    public Map<String, Long> getApplicationsByService() { return applicationsByService; }
    public void setApplicationsByService(Map<String, Long> applicationsByService) { this.applicationsByService = applicationsByService; }
    
    private Map<String, Long> applicationsByDepartment;
    private Map<String, Long> officerWorkload;

    public Map<String, Long> getApplicationsByDepartment() { return applicationsByDepartment; }
    public void setApplicationsByDepartment(Map<String, Long> applicationsByDepartment) { this.applicationsByDepartment = applicationsByDepartment; }
    public Map<String, Long> getOfficerWorkload() { return officerWorkload; }
    public void setOfficerWorkload(Map<String, Long> officerWorkload) { this.officerWorkload = officerWorkload; }
}
