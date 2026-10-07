package com.mahaseva.mahasevacore.service;

import com.mahaseva.mahasevacore.dto.DepartmentDTO;
import com.mahaseva.mahasevacore.dto.ServiceItemDTO;
import com.mahaseva.mahasevacore.entity.Department;
import com.mahaseva.mahasevacore.entity.ServiceItem;
import com.mahaseva.mahasevacore.repository.DepartmentRepository;
import com.mahaseva.mahasevacore.repository.ServiceItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CatalogueService {

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private ServiceItemRepository serviceItemRepository;

    public List<DepartmentDTO> getAllDepartments() {
        return departmentRepository.findAll().stream().map(this::mapToDepartmentDTO).collect(Collectors.toList());
    }

    public List<ServiceItemDTO> getAllServices() {
        return serviceItemRepository.findAll().stream().map(this::mapToServiceItemDTO).collect(Collectors.toList());
    }

    public ServiceItemDTO getServiceById(String id) {
        return serviceItemRepository.findById(id).map(this::mapToServiceItemDTO).orElse(null);
    }

    public List<ServiceItemDTO> getServicesByDepartment(String departmentId) {
        return serviceItemRepository.findByDepartmentId(departmentId).stream().map(this::mapToServiceItemDTO).collect(Collectors.toList());
    }

    public List<ServiceItemDTO> searchServices(String query, String departmentId) {
        List<ServiceItem> items;
        if (departmentId != null && !departmentId.isEmpty()) {
            items = serviceItemRepository.findByDepartmentId(departmentId);
        } else {
            items = serviceItemRepository.findAll();
        }

        if (query == null || query.trim().isEmpty()) {
            return items.stream().map(this::mapToServiceItemDTO).collect(Collectors.toList());
        }

        String lowerQuery = query.toLowerCase();
        return items.stream()
                .filter(item -> 
                    (item.getName() != null && item.getName().toLowerCase().contains(lowerQuery)) ||
                    (item.getDescription() != null && item.getDescription().toLowerCase().contains(lowerQuery)) ||
                    (item.getDepartment() != null && item.getDepartment().getName() != null && item.getDepartment().getName().toLowerCase().contains(lowerQuery))
                )
                .map(this::mapToServiceItemDTO)
                .collect(Collectors.toList());
    }

    private DepartmentDTO mapToDepartmentDTO(Department department) {
        DepartmentDTO dto = new DepartmentDTO();
        dto.setId(department.getId());
        dto.setName(department.getName());
        dto.setDescription(department.getDescription());
        dto.setCode(department.getCode());
        return dto;
    }

    private ServiceItemDTO mapToServiceItemDTO(ServiceItem item) {
        ServiceItemDTO dto = new ServiceItemDTO();
        dto.setId(item.getId());
        dto.setName(item.getName());
        dto.setDescription(item.getDescription());
        dto.setEligibility(item.getEligibility());
        dto.setRequiredDocuments(item.getRequiredDocuments());
        dto.setProcessingTime(item.getProcessingTime());
        dto.setFee(item.getFee());
        dto.setApplicationProcess(item.getApplicationProcess());
        dto.setActive(item.isActive());
        if (item.getUpdatedAt() != null) {
            dto.setLastUpdated(item.getUpdatedAt().toString());
        }
        if (item.getDepartment() != null) {
            dto.setDepartment(mapToDepartmentDTO(item.getDepartment()));
        }
        return dto;
    }
}
