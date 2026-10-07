package com.mahaseva.mahasevacore.dto;

import java.util.Map;
import java.util.List;

public class ApplicationRequestDTO {
    private String serviceId;
    private Map<String, Object> formData;
    private List<String> documents;
    private boolean submit; // If true, status is SUBMITTED, else DRAFT

    // Getters and Setters
    public String getServiceId() { return serviceId; }
    public void setServiceId(String serviceId) { this.serviceId = serviceId; }
    public Map<String, Object> getFormData() { return formData; }
    public void setFormData(Map<String, Object> formData) { this.formData = formData; }
    public List<String> getDocuments() { return documents; }
    public void setDocuments(List<String> documents) { this.documents = documents; }
    public boolean isSubmit() { return submit; }
    public void setSubmit(boolean submit) { this.submit = submit; }
}
