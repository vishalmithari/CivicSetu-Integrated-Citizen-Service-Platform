package com.mahaseva.mahasevacore.controller;

import com.mahaseva.mahasevacore.dto.DepartmentDTO;
import com.mahaseva.mahasevacore.dto.ServiceItemDTO;
import com.mahaseva.mahasevacore.service.CatalogueService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class CatalogueController {

    @Autowired
    private CatalogueService catalogueService;

    @GetMapping("/departments")
    public ResponseEntity<List<DepartmentDTO>> getAllDepartments() {
        return ResponseEntity.ok(catalogueService.getAllDepartments());
    }

    @GetMapping("/services")
    public ResponseEntity<List<ServiceItemDTO>> getAllServices() {
        return ResponseEntity.ok(catalogueService.getAllServices());
    }

    @GetMapping("/services/{id}")
    public ResponseEntity<ServiceItemDTO> getServiceById(@PathVariable String id) {
        ServiceItemDTO service = catalogueService.getServiceById(id);
        return service != null ? ResponseEntity.ok(service) : ResponseEntity.notFound().build();
    }

    @GetMapping("/services/department/{departmentId}")
    public ResponseEntity<List<ServiceItemDTO>> getServicesByDepartment(@PathVariable String departmentId) {
        return ResponseEntity.ok(catalogueService.getServicesByDepartment(departmentId));
    }

    @GetMapping("/services/search")
    public ResponseEntity<List<ServiceItemDTO>> searchServices(
            @RequestParam String query,
            @RequestParam(required = false) String departmentId) {
        return ResponseEntity.ok(catalogueService.searchServices(query, departmentId));
    }
}
