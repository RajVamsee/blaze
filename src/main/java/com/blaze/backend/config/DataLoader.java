package com.blaze.backend.config;

import com.blaze.backend.entity.Role;
import com.blaze.backend.entity.User;
import com.blaze.backend.repository.RoleRepository;
import com.blaze.backend.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataLoader implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataLoader(RoleRepository roleRepository,
                      UserRepository userRepository,
                      PasswordEncoder passwordEncoder) {
        this.roleRepository = roleRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        // Create roles if they don't exist
        Role adminRole = roleRepository.findByName("ROLE_ADMIN")
                .orElseGet(() -> roleRepository.save(new Role(null, "ROLE_ADMIN")));

        Role devRole = roleRepository.findByName("ROLE_DEVELOPER")
                .orElseGet(() -> roleRepository.save(new Role(null, "ROLE_DEVELOPER")));

        // Seed admin user if not present
        if (userRepository.findByUsername("admin").isEmpty()) {
            User admin = new User();
            admin.setUsername("admin");
            admin.setEmail("admin@blaze.dev");
            admin.setPasswordHash(passwordEncoder.encode("admin123"));
            admin.setRole(adminRole);
            admin.setStatus("APPROVED");
            userRepository.save(admin);
            System.out.println("==> Seeded admin user: admin / admin123");
        }

        // Seed a pre-approved developer for quick testing
        if (userRepository.findByUsername("dev").isEmpty()) {
            User dev = new User();
            dev.setUsername("dev");
            dev.setEmail("dev@blaze.dev");
            dev.setPasswordHash(passwordEncoder.encode("dev123"));
            dev.setRole(devRole);
            dev.setStatus("APPROVED");
            userRepository.save(dev);
            System.out.println("==> Seeded developer user: dev / dev123");
        }
    }
}
