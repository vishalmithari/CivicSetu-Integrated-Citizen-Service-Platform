package com.mahaseva.mahasevacore.repository;

import com.mahaseva.mahasevacore.entity.Application;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ApplicationRepository extends MongoRepository<Application, String> {
    List<Application> findByCitizenId(String citizenId);
    List<Application> findByDepartmentId(String departmentId);
    
    // Used to generate next application number
    long count();
}
