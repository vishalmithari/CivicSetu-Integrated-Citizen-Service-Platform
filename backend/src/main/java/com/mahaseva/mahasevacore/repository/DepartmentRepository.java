package com.mahaseva.mahasevacore.repository;

import com.mahaseva.mahasevacore.entity.Department;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DepartmentRepository extends MongoRepository<Department, String> {
    Optional<Department> findByCode(String code);
}
