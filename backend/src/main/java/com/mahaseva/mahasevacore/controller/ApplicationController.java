package com.mahaseva.mahasevacore.controller;

import com.mahaseva.mahasevacore.dto.ApplicationRequestDTO;
import com.mahaseva.mahasevacore.dto.ApplicationResponseDTO;
import com.mahaseva.mahasevacore.service.ApplicationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/applications")
public class ApplicationController {

    @Autowired
    private ApplicationService applicationService;

    @PostMapping
    public ResponseEntity<?> createApplication(@RequestBody ApplicationRequestDTO request) {
        try {
            ApplicationResponseDTO response = applicationService.createApplication(request);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateApplication(@PathVariable String id, @RequestBody ApplicationRequestDTO request) {
        try {
            ApplicationResponseDTO response = applicationService.updateApplication(id, request);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            if (e.getMessage().equals("Unauthorized")) return ResponseEntity.status(403).body(Map.of("error", "Unauthorized"));
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/my")
    public ResponseEntity<List<ApplicationResponseDTO>> getMyApplications() {
        return ResponseEntity.ok(applicationService.getMyApplications());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getApplicationById(@PathVariable String id) {
        try {
            ApplicationResponseDTO response = applicationService.getApplicationById(id);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            if (e.getMessage().equals("Unauthorized")) return ResponseEntity.status(403).body(Map.of("error", "Unauthorized"));
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/{id}/status")
    public ResponseEntity<?> getApplicationStatus(@PathVariable String id) {
        try {
            ApplicationResponseDTO app = applicationService.getApplicationById(id);
            return ResponseEntity.ok(Map.of("status", app.getStatus()));
        } catch (RuntimeException e) {
            if (e.getMessage().equals("Unauthorized")) return ResponseEntity.status(403).body(Map.of("error", "Unauthorized"));
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteApplication(@PathVariable String id) {
        try {
            applicationService.deleteApplication(id);
            return ResponseEntity.ok(Map.of("message", "Deleted successfully"));
        } catch (RuntimeException e) {
            if (e.getMessage().equals("Unauthorized")) return ResponseEntity.status(403).body(Map.of("error", "Unauthorized"));
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
