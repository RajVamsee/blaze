package com.blaze.backend.config;

import com.blaze.backend.entity.Role;
import com.blaze.backend.entity.User;
import com.blaze.backend.repository.RoleRepository;
import com.blaze.backend.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataSeeder(RoleRepository roleRepository,
                      UserRepository userRepository,
                      PasswordEncoder passwordEncoder) {
        this.roleRepository = roleRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        Role adminRole = roleRepository.findByName("ROLE_ADMIN")
                .orElseGet(() -> {
                    Role role = new Role();
                    role.setName("ROLE_ADMIN");
                    return roleRepository.save(role);
                });

        roleRepository.findByName("ROLE_DEVELOPER")
                .orElseGet(() -> {
                    Role role = new Role();
                    role.setName("ROLE_DEVELOPER");
                    return roleRepository.save(role);
                });

        if (userRepository.findByUsername("admin").isEmpty()) {
            User admin = new User();
            admin.setUsername("admin");
            admin.setEmail("admin@blaze.dev");
            admin.setPasswordHash(passwordEncoder.encode("admin123"));
            admin.setRole(adminRole);
            admin.setStatus("APPROVED");
            userRepository.save(admin);

            System.out.println("=== BLAZE DATA SEEDER ===");
            System.out.println("Admin user created -> username: admin / password: admin123");
            System.out.println("=========================");
        }
    }
}
