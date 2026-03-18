package com.blaze.backend.controller;

import com.blaze.backend.entity.User;
import com.blaze.backend.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final UserRepository userRepository;

    public AdminController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping("/pending-users")
    public ResponseEntity<List<User>> getPendingUsers() {
        List<User> pendingUsers = userRepository.findByStatus("PENDING");
        return ResponseEntity.ok(pendingUsers);
    }

    @PostMapping("/approve/{userId}")
    public ResponseEntity<String> approveUser(@PathVariable Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        user.setStatus("APPROVED");
        userRepository.save(user);

        return ResponseEntity.ok("User '" + user.getUsername() + "' has been approved.");
    }
}
