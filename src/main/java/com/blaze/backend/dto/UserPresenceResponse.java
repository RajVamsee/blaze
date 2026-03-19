package com.blaze.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UserPresenceResponse {
    private Long id;
    private String username;
    private String presenceStatus; // ONLINE, IDLE, OFFLINE
}
