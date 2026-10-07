package com.mahaseva.mahasevacore.service;

import com.mahaseva.mahasevacore.entity.AuditLog;
import com.mahaseva.mahasevacore.repository.AuditLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AuditService {

    @Autowired
    private AuditLogRepository auditLogRepository;

    public void logAction(String actorId, String actorRole, String action, String resource, String resourceId, String details) {
        AuditLog log = new AuditLog(actorId, actorRole, action, resource, resourceId, details);
        auditLogRepository.save(log);
    }
}
