package com.mahaseva.mahasevacore.controller;

import com.mahaseva.mahasevacore.entity.Notification;
import com.mahaseva.mahasevacore.repository.NotificationRepository;
import com.mahaseva.mahasevacore.security.UserPrincipal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@PreAuthorize("isAuthenticated()")
public class NotificationController {

    @Autowired
    private NotificationRepository notificationRepository;

    private String getUserId() {
        UserPrincipal userPrincipal = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return userPrincipal.getId();
    }

    @GetMapping
    public ResponseEntity<List<Notification>> getUserNotifications() {
        return ResponseEntity.ok(notificationRepository.findByUserIdOrderByCreatedAtDesc(getUserId()));
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<?> markAsRead(@PathVariable String id) {
        Notification notification = notificationRepository.findById(id).orElse(null);
        if (notification == null || !notification.getUserId().equals(getUserId())) {
            return ResponseEntity.notFound().build();
        }
        notification.setRead(true);
        notificationRepository.save(notification);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/read-all")
    public ResponseEntity<?> markAllAsRead() {
        List<Notification> unread = notificationRepository.findByUserIdOrderByCreatedAtDesc(getUserId())
                .stream().filter(n -> !n.isRead()).toList();
        unread.forEach(n -> n.setRead(true));
        notificationRepository.saveAll(unread);
        return ResponseEntity.ok().build();
    }
}
