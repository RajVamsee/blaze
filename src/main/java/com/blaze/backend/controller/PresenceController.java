package com.blaze.backend.controller;

import com.blaze.backend.dto.UserPresenceResponse;
import com.blaze.backend.entity.User;
import com.blaze.backend.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/presence")
public class PresenceController {

    private final UserRepository userRepository;

    public PresenceController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @PostMapping("/heartbeat")
    public ResponseEntity<Void> heartbeat(Principal principal) {
        userRepository.findByUsername(principal.getName()).ifPresent(user -> {
            user.setLastSeenAt(LocalDateTime.now());
            userRepository.save(user);
        });
        return ResponseEntity.ok().build();
    }

    @GetMapping("/team")
    public ResponseEntity<List<UserPresenceResponse>> getTeam() {
        List<UserPresenceResponse> team = userRepository.findApprovedDevelopers()
                .stream()
                .map(this::toPresenceResponse)
                .toList();
        return ResponseEntity.ok(team);
    }

    private UserPresenceResponse toPresenceResponse(User user) {
        String status = "OFFLINE";
        if (user.getLastSeenAt() != null) {
            long minutesAgo = java.time.Duration.between(user.getLastSeenAt(), LocalDateTime.now()).toMinutes();
            if (minutesAgo <= 2) status = "ONLINE";
            else if (minutesAgo <= 10) status = "IDLE";
        }
        return new UserPresenceResponse(user.getId(), user.getUsername(), status);
    }
}
