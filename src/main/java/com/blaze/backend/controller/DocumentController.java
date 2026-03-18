package com.blaze.backend.controller;

import com.blaze.backend.dto.DocumentRequest;
import com.blaze.backend.dto.DocumentResponse;
import com.blaze.backend.entity.Document;
import com.blaze.backend.entity.User;
import com.blaze.backend.repository.UserRepository;
import com.blaze.backend.service.DocumentService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/documents")
public class DocumentController {

    private final DocumentService documentService;
    private final UserRepository userRepository;

    public DocumentController(DocumentService documentService, UserRepository userRepository) {
        this.documentService = documentService;
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<List<DocumentResponse>> getAllDocuments() {
        List<DocumentResponse> responses = documentService.getAllDocuments().stream()
                .map(this::toResponse)
                .toList();
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/{id}")
    public ResponseEntity<DocumentResponse> getDocumentById(@PathVariable Long id) {
        Document document = documentService.getDocumentById(id);
        return ResponseEntity.ok(toResponse(document));
    }

    @PostMapping
    public ResponseEntity<DocumentResponse> createDocument(@RequestBody DocumentRequest request) {
        Long authorId = getCurrentUserId();
        Document document = documentService.createDocument(request, authorId);
        return ResponseEntity.ok(toResponse(document));
    }

    @PutMapping("/{id}")
    public ResponseEntity<DocumentResponse> updateDocument(@PathVariable Long id,
                                                           @RequestBody DocumentRequest request) {
        Long requesterId = getCurrentUserId();
        Document document = documentService.updateDocument(id, request, requesterId);
        return ResponseEntity.ok(toResponse(document));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteDocument(@PathVariable Long id) {
        Long requesterId = getCurrentUserId();
        documentService.deleteDocument(id, requesterId);
        return ResponseEntity.ok("Document deleted successfully.");
    }

    private Long getCurrentUserId() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));
        return user.getId();
    }

    private DocumentResponse toResponse(Document doc) {
        return new DocumentResponse(
                doc.getId(),
                doc.getTitle(),
                doc.getContent(),
                doc.getAuthorId(),
                doc.getCreatedAt(),
                doc.getUpdatedAt()
        );
    }
}
