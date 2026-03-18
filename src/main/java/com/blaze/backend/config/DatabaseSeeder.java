package com.blaze.backend.config;

import com.blaze.backend.entity.Role;
import com.blaze.backend.entity.User;
import com.blaze.backend.repository.RoleRepository;
import com.blaze.backend.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;

@Configuration
public class DatabaseSeeder {

    @Bean
    public CommandLineRunner seedDatabase(RoleRepository roleRepository, UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            // Seed Roles
            Role adminRole = roleRepository.findByName("ROLE_ADMIN").orElseGet(() -> {
                Role r = new Role();
                r.setName("ROLE_ADMIN");
                return roleRepository.save(r);
            });

            roleRepository.findByName("ROLE_DEVELOPER").orElseGet(() -> {
                Role r = new Role();
                r.setName("ROLE_DEVELOPER");
                return roleRepository.save(r);
            });

            // Seed Admin User
            if (userRepository.findByUsername("admin").isEmpty()) {
                User admin = new User();
                admin.setUsername("admin");
                admin.setEmail("admin@blaze.local");
                admin.setPasswordHash(passwordEncoder.encode("admin123"));
                admin.setRole(adminRole);
                admin.setStatus("APPROVED");
                // Setting createdAt here if not auto-managed by @PrePersist before save
                admin.setCreatedAt(LocalDateTime.now());
                userRepository.save(admin);
                System.out.println("====== STARTUP SYSTEM AUDIT ======");
                System.out.println("SEED: Initial Roles Created.");
                System.out.println("SEED: Admin user created [Username: admin | Password: admin123]");
                System.out.println("==================================");
            }
        };
    }
}
