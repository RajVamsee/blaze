package com.blaze.backend.config;

import com.blaze.backend.entity.Document;
import com.blaze.backend.entity.Role;
import com.blaze.backend.entity.User;
import com.blaze.backend.repository.DocumentRepository;
import com.blaze.backend.repository.RoleRepository;
import com.blaze.backend.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final DocumentRepository documentRepository;
    private final PasswordEncoder passwordEncoder;

    public DataSeeder(RoleRepository roleRepository,
                      UserRepository userRepository,
                      DocumentRepository documentRepository,
                      PasswordEncoder passwordEncoder) {
        this.roleRepository = roleRepository;
        this.userRepository = userRepository;
        this.documentRepository = documentRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        // --- Roles ---
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

        // --- Admin user ---
        User admin = userRepository.findByUsername("admin").orElseGet(() -> {
            User u = new User();
            u.setUsername("admin");
            u.setEmail("admin@blaze.dev");
            u.setPasswordHash(passwordEncoder.encode("admin123"));
            u.setRole(adminRole);
            u.setStatus("APPROVED");
            System.out.println("==> Seeded admin user: admin / admin123");
            return userRepository.save(u);
        });

        // --- Seed sample documents if workspace is empty ---
        if (documentRepository.count() == 0) {
            seedDocument(admin.getId(),
                    "Welcome to Blaze",
                    "Blaze is a collaborative workspace for developers and teams.\n\n" +
                    "Use this space to document ideas, track decisions, and share knowledge with your team.\n\n" +
                    "Admin documents are read-only for all other users. Create your own documents to collaborate with teammates.");

            seedDocument(admin.getId(),
                    "Getting Started Guide",
                    "How to use Blaze:\n\n" +
                    "1. Create a new document using the '+ New Document' button.\n" +
                    "2. Your documents are editable only by you by default.\n" +
                    "3. Other users can request edit access — you'll see their requests in the 'Access Requests' section when you open your document.\n" +
                    "4. Approve or deny requests directly from the document editor.\n\n" +
                    "Admin can view and manage all documents and users across the workspace.");

            System.out.println("==> Seeded 2 sample documents");
        }
    }

    private void seedDocument(Long authorId, String title, String content) {
        Document doc = new Document();
        doc.setAuthorId(authorId);
        doc.setTitle(title);
        doc.setContent(content);
        documentRepository.save(doc);
    }
}
