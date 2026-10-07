package com.mahaseva.mahasevacore.repository;

import com.mahaseva.mahasevacore.entity.DocumentRecord;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DocumentRepository extends MongoRepository<DocumentRecord, String> {
    List<DocumentRecord> findByApplicationId(String applicationId);
}
