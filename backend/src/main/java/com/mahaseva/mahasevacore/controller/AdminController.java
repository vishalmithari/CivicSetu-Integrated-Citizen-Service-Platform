package com.mahaseva.mahasevacore.controller;

import com.mahaseva.mahasevacore.dto.AssignOfficerRequestDTO;
import com.mahaseva.mahasevacore.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasAnyRole('DEPT_ADMIN', 'SUPER_ADMIN')")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @GetMapping("/dashboard/stats")
    public ResponseEntity<?> getStats() {
        try {
            return ResponseEntity.ok(adminService.getDashboardStats());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/applications")
    public ResponseEntity<?> getApplications() {
        try {
            return ResponseEntity.ok(adminService.getApplications());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/applications/{id}")
    public ResponseEntity<?> getApplicationDetails(@PathVariable String id) {
        try {
            return ResponseEntity.ok(adminService.getApplicationDetails(id));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/officers")
    public ResponseEntity<?> getOfficers() {
        try {
            return ResponseEntity.ok(adminService.getOfficers());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/applications/{id}/assign")
    public ResponseEntity<?> assignApplication(@PathVariable String id, @RequestBody AssignOfficerRequestDTO request) {
        try {
            return ResponseEntity.ok(adminService.assignApplication(id, request.getOfficerId()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/services/{id}/status")
    public ResponseEntity<?> updateServiceStatus(@PathVariable String id, @RequestBody Map<String, Boolean> request) {
        try {
            return ResponseEntity.ok(adminService.updateServiceStatus(id, request.get("active")));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/reports")
    public ResponseEntity<?> getReports(
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        try {
            return ResponseEntity.ok(adminService.getReports(startDate, endDate));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
