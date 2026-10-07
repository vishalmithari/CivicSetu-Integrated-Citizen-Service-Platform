package com.mahaseva.mahasevacore.service;

import com.mahaseva.mahasevacore.entity.Application;
import com.mahaseva.mahasevacore.entity.DocumentRecord;
import com.mahaseva.mahasevacore.entity.DocumentStatus;
import com.mahaseva.mahasevacore.entity.Notification;
import com.mahaseva.mahasevacore.repository.ApplicationRepository;
import com.mahaseva.mahasevacore.repository.DocumentRepository;
import com.mahaseva.mahasevacore.repository.NotificationRepository;
import com.mahaseva.mahasevacore.security.UserPrincipal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@Service
public class DocumentService {

    @Autowired
    private DocumentRepository documentRepository;

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    private final Path fileStorageLocation;
    private final List<String> ALLOWED_CONTENT_TYPES = Arrays.asList("application/pdf", "image/jpeg", "image/jpg", "image/png");
    private final long MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

    public DocumentService() {
        this.fileStorageLocation = Paths.get("uploads").toAbsolutePath().normalize();
        try {
            Files.createDirectories(this.fileStorageLocation);
        } catch (Exception ex) {
            throw new RuntimeException("Could not create the directory where the uploaded files will be stored.", ex);
        }
    }

    private UserPrincipal getCurrentUser() {
        return (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }

    public DocumentRecord uploadDocument(String applicationId, String documentType, MultipartFile file) {
        UserPrincipal user = getCurrentUser();
        
        Application app = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        if (!app.getCitizenId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized");
        }
        
        if (file.isEmpty()) {
            throw new RuntimeException("Cannot store empty file.");
        }
        
        if (file.getSize() > MAX_FILE_SIZE) {
            throw new RuntimeException("File size exceeds 5MB limit.");
        }
        
        if (!ALLOWED_CONTENT_TYPES.contains(file.getContentType())) {
            throw new RuntimeException("Invalid file type. Only PDF, JPG, and PNG are allowed.");
        }

        try {
            // Check for existing document of this type and delete physically
            List<DocumentRecord> existingDocs = documentRepository.findByApplicationId(applicationId);
            for (DocumentRecord doc : existingDocs) {
                if (doc.getDocumentType().equals(documentType)) {
                    deleteDocument(doc.getId()); // Helper deletes physical and logical
                    break;
                }
            }

            String originalName = file.getOriginalFilename();
            if (originalName != null && originalName.contains("..")) {
                throw new RuntimeException("Sorry! Filename contains invalid path sequence " + originalName);
            }

            String extension = "";
            if (originalName != null && originalName.lastIndexOf(".") > 0) {
                extension = originalName.substring(originalName.lastIndexOf("."));
            }

            String safeFileName = UUID.randomUUID().toString() + extension;
            Path targetLocation = this.fileStorageLocation.resolve(safeFileName);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            DocumentRecord doc = new DocumentRecord();
            doc.setApplicationId(applicationId);
            doc.setCitizenId(user.getId());
            doc.setDocumentType(documentType);
            doc.setOriginalFileName(originalName);
            doc.setFileType(file.getContentType());
            doc.setFileSize(file.getSize());
            doc.setStoragePath(safeFileName);
            doc.setStatus(DocumentStatus.UPLOADED);
            doc.setUploadedAt(LocalDateTime.now());

            DocumentRecord savedDoc = documentRepository.save(doc);
            
            notificationRepository.save(new Notification(user.getId(), "Document Uploaded", "Document '" + documentType + "' uploaded for application " + app.getApplicationNumber(), app.getId()));
            
            return savedDoc;
        } catch (IOException ex) {
            throw new RuntimeException("Could not store file. Please try again!", ex);
        }
    }

    public List<DocumentRecord> getDocumentsByApplication(String applicationId) {
        UserPrincipal user = getCurrentUser();
        Application app = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        if (!app.getCitizenId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized");
        }

        return documentRepository.findByApplicationId(applicationId);
    }

    public Resource loadFileAsResource(String documentId) {
        UserPrincipal user = getCurrentUser();
        DocumentRecord doc = documentRepository.findById(documentId)
                .orElseThrow(() -> new RuntimeException("Document not found"));
                
        // In the future, officers will also be able to read this. 
        // For now, only the owner can read.
        if (!doc.getCitizenId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized");
        }

        try {
            Path filePath = this.fileStorageLocation.resolve(doc.getStoragePath()).normalize();
            Resource resource = new UrlResource(filePath.toUri());
            if(resource.exists()) {
                return resource;
            } else {
                throw new RuntimeException("File not found");
            }
        } catch (Exception ex) {
            throw new RuntimeException("File not found", ex);
        }
    }
    
    public DocumentRecord getDocumentMetadata(String documentId) {
        UserPrincipal user = getCurrentUser();
        DocumentRecord doc = documentRepository.findById(documentId)
                .orElseThrow(() -> new RuntimeException("Document not found"));
        if (!doc.getCitizenId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized");
        }
        return doc;
    }

    public void deleteDocument(String documentId) {
        UserPrincipal user = getCurrentUser();
        DocumentRecord doc = documentRepository.findById(documentId)
                .orElseThrow(() -> new RuntimeException("Document not found"));

        if (!doc.getCitizenId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized");
        }

        try {
            Path filePath = this.fileStorageLocation.resolve(doc.getStoragePath()).normalize();
            Files.deleteIfExists(filePath);
            documentRepository.delete(doc);
        } catch (IOException ex) {
            throw new RuntimeException("Could not delete file.", ex);
        }
    }
    
    // Preparation for Officer
    public DocumentRecord verifyDocument(String documentId, String officerId, boolean approved, String remarks) {
        DocumentRecord doc = documentRepository.findById(documentId)
                .orElseThrow(() -> new RuntimeException("Document not found"));
        doc.setStatus(approved ? DocumentStatus.VERIFIED : DocumentStatus.REJECTED);
        if (remarks != null) doc.setRemarks(remarks);
        doc.setVerifiedBy(officerId);
        doc.setVerifiedAt(LocalDateTime.now());
        
        notificationRepository.save(new Notification(doc.getCitizenId(), 
            "Document '" + doc.getDocumentType() + "' has been " + (approved ? "Verified" : "Rejected")));
            
        return documentRepository.save(doc);
    }
}
