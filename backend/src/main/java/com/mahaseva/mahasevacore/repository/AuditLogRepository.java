package com.mahaseva.mahasevacore.repository;

import com.mahaseva.mahasevacore.entity.AuditLog;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AuditLogRepository extends MongoRepository<AuditLog, String> {
}
