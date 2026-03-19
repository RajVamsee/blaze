package com.blaze.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class DocumentPermissionResponse {
    private Long id;
    private Long requesterId;
    private String requesterUsername;
    private String status;
    private LocalDateTime createdAt;
}
