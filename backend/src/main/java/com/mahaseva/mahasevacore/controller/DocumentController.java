package com.mahaseva.mahasevacore.controller;

import com.mahaseva.mahasevacore.entity.DocumentRecord;
import com.mahaseva.mahasevacore.service.DocumentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class DocumentController {

    @Autowired
    private DocumentService documentService;

    @PostMapping("/applications/{applicationId}/documents")
    public ResponseEntity<?> uploadDocument(
            @PathVariable String applicationId,
            @RequestParam("documentType") String documentType,
            @RequestParam("file") MultipartFile file) {
        try {
            DocumentRecord doc = documentService.uploadDocument(applicationId, documentType, file);
            return ResponseEntity.ok(doc);
        } catch (RuntimeException e) {
            if (e.getMessage().equals("Unauthorized")) return ResponseEntity.status(403).body(Map.of("error", "Unauthorized"));
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/applications/{applicationId}/documents")
    public ResponseEntity<?> getDocuments(@PathVariable String applicationId) {
        try {
            List<DocumentRecord> docs = documentService.getDocumentsByApplication(applicationId);
            return ResponseEntity.ok(docs);
        } catch (RuntimeException e) {
            if (e.getMessage().equals("Unauthorized")) return ResponseEntity.status(403).body(Map.of("error", "Unauthorized"));
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @GetMapping("/documents/{documentId}/metadata")
    public ResponseEntity<?> getDocumentMetadata(@PathVariable String documentId) {
        try {
            return ResponseEntity.ok(documentService.getDocumentMetadata(documentId));
        } catch (RuntimeException e) {
            if (e.getMessage().equals("Unauthorized")) return ResponseEntity.status(403).body(Map.of("error", "Unauthorized"));
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/documents/{documentId}")
    public ResponseEntity<Resource> downloadDocument(@PathVariable String documentId) {
        try {
            DocumentRecord metadata = documentService.getDocumentMetadata(documentId);
            Resource resource = documentService.loadFileAsResource(documentId);
            
            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(metadata.getFileType()))
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + metadata.getOriginalFileName() + "\"")
                    .body(resource);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/documents/{documentId}")
    public ResponseEntity<?> deleteDocument(@PathVariable String documentId) {
        try {
            documentService.deleteDocument(documentId);
            return ResponseEntity.ok(Map.of("message", "Deleted successfully"));
        } catch (RuntimeException e) {
            if (e.getMessage().equals("Unauthorized")) return ResponseEntity.status(403).body(Map.of("error", "Unauthorized"));
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
