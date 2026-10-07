package com.mahaseva.mahasevacore.controller;

import com.mahaseva.mahasevacore.entity.User;
import com.mahaseva.mahasevacore.repository.UserRepository;
import com.mahaseva.mahasevacore.security.UserPrincipal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@PreAuthorize("isAuthenticated()")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private User getCurrentUser() {
        UserPrincipal userPrincipal = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return userRepository.findById(userPrincipal.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @PutMapping("/me")
    public ResponseEntity<?> updateProfile(@RequestBody Map<String, String> updates) {
        try {
            User user = getCurrentUser();
            if (updates.containsKey("firstName")) user.setFirstName(updates.get("firstName"));
            if (updates.containsKey("lastName")) user.setLastName(updates.get("lastName"));
            // Do NOT allow changing role or department
            user.setUpdatedAt(LocalDateTime.now());
            userRepository.save(user);
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/me/password")
    public ResponseEntity<?> updatePassword(@RequestBody Map<String, String> request) {
        try {
            User user = getCurrentUser();
            String currentPassword = request.get("currentPassword");
            String newPassword = request.get("newPassword");

            if (!passwordEncoder.matches(currentPassword, user.getPasswordHash())) {
                return ResponseEntity.badRequest().body(Map.of("error", "Current password is incorrect"));
            }

            user.setPasswordHash(passwordEncoder.encode(newPassword));
            user.setUpdatedAt(LocalDateTime.now());
            userRepository.save(user);
            return ResponseEntity.ok(Map.of("message", "Password updated successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
