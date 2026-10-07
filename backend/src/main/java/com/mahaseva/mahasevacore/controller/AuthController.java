package com.mahaseva.mahasevacore.controller;

import com.mahaseva.mahasevacore.dto.JwtAuthenticationResponse;
import com.mahaseva.mahasevacore.dto.LoginRequest;
import com.mahaseva.mahasevacore.dto.RegisterRequest;
import com.mahaseva.mahasevacore.entity.Role;
import com.mahaseva.mahasevacore.entity.User;
import com.mahaseva.mahasevacore.repository.UserRepository;
import com.mahaseva.mahasevacore.security.JwtTokenProvider;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Collections;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepository userRepository;

    @Autowired
    PasswordEncoder passwordEncoder;

    @Autowired
    JwtTokenProvider tokenProvider;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getUsernameOrEmail(),
                        loginRequest.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.generateToken(authentication);

        return ResponseEntity.ok(new JwtAuthenticationResponse(jwt));
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody RegisterRequest registerRequest) {
        if(userRepository.existsByUsername(registerRequest.getUsername())) {
            return new ResponseEntity<>("Username is already taken!", HttpStatus.BAD_REQUEST);
        }

        if(userRepository.existsByEmail(registerRequest.getEmail())) {
            return new ResponseEntity<>("Email Address already in use!", HttpStatus.BAD_REQUEST);
        }

        User user = new User();
        user.setUsername(registerRequest.getUsername());
        user.setEmail(registerRequest.getEmail());
        user.setPasswordHash(passwordEncoder.encode(registerRequest.getPassword()));
        user.setFirstName(registerRequest.getFirstName());
        user.setLastName(registerRequest.getLastName());
        user.setRoles(Collections.singleton(Role.ROLE_CITIZEN));
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());

        userRepository.save(user);

        return new ResponseEntity<>("User registered successfully", HttpStatus.CREATED);
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        User user = userRepository.findByUsername(authentication.getName())
                .orElse(null);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        return ResponseEntity.ok(user);
    }

    @PostMapping("/seed-officer")
    public ResponseEntity<?> seedOfficer(@RequestParam String departmentId) {
        if(userRepository.existsByUsername("officer1")) {
            return ResponseEntity.ok("Already seeded");
        }
        User user = new User();
        user.setUsername("officer1");
        user.setEmail("officer1@mahaseva.com");
        user.setPasswordHash(passwordEncoder.encode("password123"));
        user.setFirstName("Revenue");
        user.setLastName("Officer");
        user.setRoles(Collections.singleton(Role.ROLE_OFFICER));
        user.setDepartmentId(departmentId);
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);
        return ResponseEntity.ok("Officer seeded successfully");
    }
}
