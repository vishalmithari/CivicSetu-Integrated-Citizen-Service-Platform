package com.mahaseva.mahasevacore.repository;

import com.mahaseva.mahasevacore.entity.ServiceItem;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ServiceItemRepository extends MongoRepository<ServiceItem, String> {
    List<ServiceItem> findByDepartmentId(String departmentId);
    
    @Query("{ 'name': { $regex: ?0, $options: 'i' } }")
    List<ServiceItem> searchByName(String keyword);
}
