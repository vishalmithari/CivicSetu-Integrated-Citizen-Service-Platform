package com.mahaseva.mahasevacore.dto;

public class DocumentActionRequestDTO {
    private String action; // VERIFY, REJECT, CORRECTION
    private String remarks;

    public String getAction() { return action; }
    public void setAction(String action) { this.action = action; }
    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }
}
