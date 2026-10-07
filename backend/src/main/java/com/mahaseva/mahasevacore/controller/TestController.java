package com.mahaseva.mahasevacore.controller;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/test")
public class TestController {

    @GetMapping("/all")
    public String allAccess() {
        return "Public Content.";
    }

    @GetMapping("/citizen")
    @PreAuthorize("hasRole('CITIZEN') or hasRole('ROLE_CITIZEN')")
    public String citizenAccess() {
        return "Citizen Content.";
    }

    @GetMapping("/officer")
    @PreAuthorize("hasRole('OFFICER') or hasRole('ROLE_OFFICER')")
    public String officerAccess() {
        return "Officer Content.";
    }

    @GetMapping("/department-admin")
    @PreAuthorize("hasRole('DEPT_ADMIN') or hasRole('ROLE_DEPT_ADMIN')")
    public String deptAdminAccess() {
        return "Department Admin Content.";
    }

    @GetMapping("/super-admin")
    @PreAuthorize("hasRole('SUPER_ADMIN') or hasRole('ROLE_SUPER_ADMIN')")
    public String superAdminAccess() {
        return "Super Admin Content.";
    }
}
