package com.mahaseva.mahasevacore.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Document(collection = "audit_logs")
public class AuditLog {
    @Id
    private String id;
    
    private String actorId;
    private String actorRole;
    private String action;
    private String resource;
    private String resourceId;
    private String details;
    private LocalDateTime timestamp;

    public AuditLog() {}

    public AuditLog(String actorId, String actorRole, String action, String resource, String resourceId, String details) {
        this.actorId = actorId;
        this.actorRole = actorRole;
        this.action = action;
        this.resource = resource;
        this.resourceId = resourceId;
        this.details = details;
        this.timestamp = LocalDateTime.now();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getActorId() { return actorId; }
    public void setActorId(String actorId) { this.actorId = actorId; }
    public String getActorRole() { return actorRole; }
    public void setActorRole(String actorRole) { this.actorRole = actorRole; }
    public String getAction() { return action; }
    public void setAction(String action) { this.action = action; }
    public String getResource() { return resource; }
    public void setResource(String resource) { this.resource = resource; }
    public String getResourceId() { return resourceId; }
    public void setResourceId(String resourceId) { this.resourceId = resourceId; }
    public String getDetails() { return details; }
    public void setDetails(String details) { this.details = details; }
    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
}
