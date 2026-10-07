package com.mahaseva.mahasevacore.dto;

import com.mahaseva.mahasevacore.entity.ApplicationStatus;

public class UpdateStatusRequestDTO {
    private ApplicationStatus status;
    private String remarks;

    public ApplicationStatus getStatus() { return status; }
    public void setStatus(ApplicationStatus status) { this.status = status; }
    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }
}
