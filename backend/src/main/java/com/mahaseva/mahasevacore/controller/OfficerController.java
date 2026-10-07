package com.mahaseva.mahasevacore.controller;

import com.mahaseva.mahasevacore.dto.DocumentActionRequestDTO;
import com.mahaseva.mahasevacore.dto.UpdateStatusRequestDTO;
import com.mahaseva.mahasevacore.service.OfficerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/officer")
@PreAuthorize("hasAnyRole('OFFICER', 'DEPT_ADMIN', 'SUPER_ADMIN')")
public class OfficerController {

    @Autowired
    private OfficerService officerService;

    @GetMapping("/dashboard/stats")
    public ResponseEntity<?> getStats() {
        try {
            return ResponseEntity.ok(officerService.getDashboardStats());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/applications")
    public ResponseEntity<?> getApplications() {
        try {
            return ResponseEntity.ok(officerService.getApplications());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/applications/{id}")
    public ResponseEntity<?> getApplicationDetails(@PathVariable String id) {
        try {
            return ResponseEntity.ok(officerService.getApplicationDetails(id));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/applications/{id}/status")
    public ResponseEntity<?> updateApplicationStatus(@PathVariable String id, @RequestBody UpdateStatusRequestDTO request) {
        try {
            return ResponseEntity.ok(officerService.updateApplicationStatus(id, request));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/documents/{id}/action")
    public ResponseEntity<?> processDocumentAction(@PathVariable String id, @RequestBody DocumentActionRequestDTO request) {
        try {
            return ResponseEntity.ok(officerService.processDocumentAction(id, request));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
