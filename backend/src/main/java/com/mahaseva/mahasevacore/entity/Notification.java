package com.mahaseva.mahasevacore.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Document(collection = "notifications")
public class Notification {
    @Id
    private String id;
    private String userId;
    private String title;
    private String message;
    private String applicationId;
    private boolean read;
    private LocalDateTime createdAt;

    public Notification() {}

    public Notification(String userId, String title, String message, String applicationId) {
        this.userId = userId;
        this.title = title;
        this.message = message;
        this.applicationId = applicationId;
        this.read = false;
        this.createdAt = LocalDateTime.now();
    }

    public Notification(String userId, String message) {
        this.userId = userId;
        this.title = "Notification";
        this.message = message;
        this.applicationId = null;
        this.read = false;
        this.createdAt = LocalDateTime.now();
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    public String getApplicationId() { return applicationId; }
    public void setApplicationId(String applicationId) { this.applicationId = applicationId; }
    public boolean isRead() { return read; }
    public void setRead(boolean read) { this.read = read; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
