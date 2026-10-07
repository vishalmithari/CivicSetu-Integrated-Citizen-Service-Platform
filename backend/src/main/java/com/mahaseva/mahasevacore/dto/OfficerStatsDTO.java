package com.mahaseva.mahasevacore.dto;

import java.util.Map;

public class OfficerStatsDTO {
    private long totalAssigned;
    private long pendingReview;
    private long documentVerification;
    private long correctionRequired;
    private long approved;
    private long rejected;
    private long completed;
    
    private Map<String, Long> applicationsByStatus;
    private Map<String, Long> applicationsByService;

    public long getTotalAssigned() { return totalAssigned; }
    public void setTotalAssigned(long totalAssigned) { this.totalAssigned = totalAssigned; }
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
    public Map<String, Long> getApplicationsByStatus() { return applicationsByStatus; }
    public void setApplicationsByStatus(Map<String, Long> applicationsByStatus) { this.applicationsByStatus = applicationsByStatus; }
    public Map<String, Long> getApplicationsByService() { return applicationsByService; }
    public void setApplicationsByService(Map<String, Long> applicationsByService) { this.applicationsByService = applicationsByService; }
}
