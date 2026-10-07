package com.mahaseva.mahasevacore.config;

import com.mahaseva.mahasevacore.entity.Department;
import com.mahaseva.mahasevacore.entity.ServiceItem;
import com.mahaseva.mahasevacore.entity.User;
import com.mahaseva.mahasevacore.repository.DepartmentRepository;
import com.mahaseva.mahasevacore.repository.ServiceItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Arrays;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private ServiceItemRepository serviceItemRepository;

    @Autowired
    private com.mahaseva.mahasevacore.repository.UserRepository userRepository;

    @Autowired
    private org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (departmentRepository.count() == 0) {
            System.out.println("Seeding demo departments...");
            Department rev = new Department("Revenue Department", "Handles land records and revenue matters.", "REV");
            Department mun = new Department("Municipal Services", "Local administration and civic services.", "MUN");
            Department agr = new Department("Agriculture Department", "Support for farmers and agriculture.", "AGR");
            Department soc = new Department("Social Welfare Department", "Schemes for underprivileged and minorities.", "SOC");
            Department trn = new Department("Transport Department", "Driving licenses and vehicle registration.", "TRN");
            
            departmentRepository.saveAll(Arrays.asList(rev, mun, agr, soc, trn));

            System.out.println("Seeding demo services...");
            createService("Income Certificate", rev, "Certificate proving annual income.", "Citizen of Maharashtra", Arrays.asList("Aadhar Card", "Salary Slip"), "7-15 Days", 50.0, "Online application followed by verification.");
            createService("Residence Certificate", rev, "Proof of residency in the state.", "Resident for 15+ years", Arrays.asList("Aadhar Card", "Utility Bill"), "15 Days", 50.0, "Apply online, submit documents.");
            createService("Domicile Certificate", rev, "Proof of domicile.", "Resident for 15+ years", Arrays.asList("Birth Certificate", "School LC"), "15 Days", 50.0, "Apply online with proofs.");
            
            createService("Water Connection Request", mun, "Apply for a new municipal water connection.", "Property owner", Arrays.asList("Property Tax Receipt", "Aadhar Card"), "30 Days", 500.0, "Online request and site inspection.");
            createService("Birth/Death Certificate Request", mun, "Request copies of certificates.", "Relative or self", Arrays.asList("Hospital Discharge/Death Note", "ID Proof"), "5 Days", 20.0, "Online search and download/print.");

            createService("Farmer Scheme Application", agr, "Financial assistance for crop loss.", "Registered Farmer", Arrays.asList("7/12 Extract", "Bank Passbook"), "30 Days", 0.0, "Submit application with land details.");
            createService("Agricultural Assistance Request", agr, "Subsidies for seeds and fertilizers.", "Registered Farmer", Arrays.asList("7/12 Extract", "Aadhar"), "15 Days", 0.0, "Online application and approval by Talathi.");

            createService("Scholarship/Scheme Application", soc, "Educational scholarship for students.", "Student from eligible category", Arrays.asList("Caste Certificate", "Income Certificate", "Marksheet"), "60 Days", 0.0, "Apply on portal, college verification.");
            createService("Welfare Scheme Application", soc, "Pension for senior citizens.", "Age > 65", Arrays.asList("Age Proof", "Income Certificate"), "45 Days", 0.0, "Online application and approval.");

            createService("Driving-related Service", trn, "Apply for Learner's License.", "Age > 18", Arrays.asList("Age Proof", "Address Proof"), "7 Days", 200.0, "Online test and issuance.");
            createService("Vehicle-related Service", trn, "RC Transfer / Renewal.", "Vehicle Owner", Arrays.asList("Original RC", "Insurance", "PUC"), "15 Days", 300.0, "Online payment and RTO visit.");
            
            System.out.println("Demo data seeded successfully.");
        }

        // Seed Users
        if (departmentRepository.count() > 0) {
            Department rev = departmentRepository.findAll().stream().filter(d -> d.getName().contains("Revenue")).findFirst().orElse(null);
            String revId = rev != null ? rev.getId() : null;

            if (!userRepository.existsByUsername("demo_citizen")) {
                User citizen = new User();
                citizen.setUsername("demo_citizen");
                citizen.setEmail("demo_citizen@mahaseva.com");
                citizen.setPasswordHash(passwordEncoder.encode("Demo@123"));
                citizen.setFirstName("Demo");
                citizen.setLastName("Citizen");
                citizen.setRoles(java.util.Collections.singleton(com.mahaseva.mahasevacore.entity.Role.ROLE_CITIZEN));
                citizen.setCreatedAt(LocalDateTime.now());
                citizen.setUpdatedAt(LocalDateTime.now());
                userRepository.save(citizen);
            }

            if (!userRepository.existsByUsername("demo_officer")) {
                User officer = new User();
                officer.setUsername("demo_officer");
                officer.setEmail("demo_officer@mahaseva.com");
                officer.setPasswordHash(passwordEncoder.encode("Demo@123"));
                officer.setFirstName("Demo");
                officer.setLastName("Officer");
                officer.setRoles(java.util.Collections.singleton(com.mahaseva.mahasevacore.entity.Role.ROLE_OFFICER));
                officer.setDepartmentId(revId);
                officer.setCreatedAt(LocalDateTime.now());
                officer.setUpdatedAt(LocalDateTime.now());
                userRepository.save(officer);
            }

            if (!userRepository.existsByUsername("demo_admin")) {
                User admin = new User();
                admin.setUsername("demo_admin");
                admin.setEmail("demo_admin@mahaseva.com");
                admin.setPasswordHash(passwordEncoder.encode("Demo@123"));
                admin.setFirstName("Demo");
                admin.setLastName("Admin");
                admin.setRoles(java.util.Collections.singleton(com.mahaseva.mahasevacore.entity.Role.ROLE_DEPT_ADMIN));
                admin.setDepartmentId(revId);
                admin.setCreatedAt(LocalDateTime.now());
                admin.setUpdatedAt(LocalDateTime.now());
                userRepository.save(admin);
            }

            if (!userRepository.existsByUsername("demo_superadmin")) {
                User superadmin = new User();
                superadmin.setUsername("demo_superadmin");
                superadmin.setEmail("demo_superadmin@mahaseva.com");
                superadmin.setPasswordHash(passwordEncoder.encode("Demo@123"));
                superadmin.setFirstName("Demo");
                superadmin.setLastName("SuperAdmin");
                superadmin.setRoles(java.util.Collections.singleton(com.mahaseva.mahasevacore.entity.Role.ROLE_SUPER_ADMIN));
                superadmin.setCreatedAt(LocalDateTime.now());
                superadmin.setUpdatedAt(LocalDateTime.now());
                userRepository.save(superadmin);
            }
        }
    }

    private void createService(String name, Department dept, String desc, String elig, java.util.List<String> docs, String time, Double fee, String process) {
        ServiceItem item = new ServiceItem();
        item.setName(name);
        item.setDepartment(dept);
        item.setDescription(desc);
        item.setEligibility(elig);
        item.setRequiredDocuments(docs);
        item.setProcessingTime(time);
        item.setFee(fee);
        item.setApplicationProcess(process);
        item.setCreatedAt(LocalDateTime.now());
        item.setUpdatedAt(LocalDateTime.now());
        serviceItemRepository.save(item);
    }
}
