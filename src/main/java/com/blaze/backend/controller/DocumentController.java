package com.blaze.backend.controller;

import com.blaze.backend.dto.DocumentPermissionResponse;
import com.blaze.backend.dto.DocumentRequest;
import com.blaze.backend.dto.DocumentResponse;
import com.blaze.backend.entity.Document;
import com.blaze.backend.entity.DocumentPermission;
import com.blaze.backend.entity.User;
import com.blaze.backend.repository.UserRepository;
import com.blaze.backend.service.DocumentService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

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
        User currentUser = getCurrentUser();
        boolean isAdmin = isCurrentUserAdmin();
        List<DocumentResponse> responses = documentService.getAllDocuments().stream()
                .map(doc -> toResponse(doc, currentUser, isAdmin))
                .toList();
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/{id}")
    public ResponseEntity<DocumentResponse> getDocumentById(@PathVariable Long id) {
        User currentUser = getCurrentUser();
        boolean isAdmin = isCurrentUserAdmin();
        Document document = documentService.getDocumentById(id);
        return ResponseEntity.ok(toResponse(document, currentUser, isAdmin));
    }

    @PostMapping
    public ResponseEntity<DocumentResponse> createDocument(@RequestBody DocumentRequest request) {
        User currentUser = getCurrentUser();
        boolean isAdmin = isCurrentUserAdmin();
        Document document = documentService.createDocument(request, currentUser.getId());
        return ResponseEntity.ok(toResponse(document, currentUser, isAdmin));
    }

    @PutMapping("/{id}")
    public ResponseEntity<DocumentResponse> updateDocument(@PathVariable Long id,
                                                           @RequestBody DocumentRequest request) {
        User currentUser = getCurrentUser();
        boolean isAdmin = isCurrentUserAdmin();
        Document document = documentService.updateDocument(id, request, currentUser.getId(), isAdmin);
        return ResponseEntity.ok(toResponse(document, currentUser, isAdmin));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteDocument(@PathVariable Long id) {
        User currentUser = getCurrentUser();
        boolean isAdmin = isCurrentUserAdmin();
        documentService.deleteDocument(id, currentUser.getId(), isAdmin);
        return ResponseEntity.ok("Document deleted successfully.");
    }

    @PostMapping("/{id}/request-access")
    public ResponseEntity<String> requestAccess(@PathVariable Long id) {
        User currentUser = getCurrentUser();
        documentService.requestAccess(id, currentUser.getId());
        return ResponseEntity.ok("Access request submitted.");
    }

    @GetMapping("/{id}/permissions")
    public ResponseEntity<List<DocumentPermissionResponse>> getPermissions(@PathVariable Long id) {
        User currentUser = getCurrentUser();
        List<DocumentPermission> perms = documentService.getPermissions(id, currentUser.getId());
        List<DocumentPermissionResponse> responses = perms.stream()
                .map(this::toPermissionResponse)
                .toList();
        return ResponseEntity.ok(responses);
    }

    @PutMapping("/{id}/permissions/{permId}/approve")
    public ResponseEntity<String> approvePermission(@PathVariable Long id, @PathVariable Long permId) {
        User currentUser = getCurrentUser();
        documentService.updatePermissionStatus(id, permId, "APPROVED", currentUser.getId());
        return ResponseEntity.ok("Permission approved.");
    }

    @PutMapping("/{id}/permissions/{permId}/deny")
    public ResponseEntity<String> denyPermission(@PathVariable Long id, @PathVariable Long permId) {
        User currentUser = getCurrentUser();
        documentService.updatePermissionStatus(id, permId, "DENIED", currentUser.getId());
        return ResponseEntity.ok("Permission denied.");
    }

    private User getCurrentUser() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));
    }

    private boolean isCurrentUserAdmin() {
        return SecurityContextHolder.getContext().getAuthentication().getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
    }

    private boolean isUserAdmin(Long userId) {
        return userRepository.findById(userId)
                .map(u -> u.getRole() != null && "ROLE_ADMIN".equals(u.getRole().getName()))
                .orElse(false);
    }

    private DocumentResponse toResponse(Document doc, User currentUser, boolean isCurrentUserAdmin) {
        boolean isOwner = doc.getAuthorId().equals(currentUser.getId());
        boolean authorIsAdmin = isUserAdmin(doc.getAuthorId());
        boolean canEdit = isCurrentUserAdmin || isOwner;
        String permissionStatus = null;

        if (!canEdit) {
            Optional<DocumentPermission> perm =
                    documentService.getPermissionForUser(doc.getId(), currentUser.getId());
            if (perm.isPresent()) {
                permissionStatus = perm.get().getStatus();
                if ("APPROVED".equals(permissionStatus)) {
                    canEdit = true;
                }
            }
        }

        // Admin-owned docs cannot be edit-requested by regular users
        boolean canRequestAccess = !isOwner && !isCurrentUserAdmin && !authorIsAdmin
                && (permissionStatus == null || "DENIED".equals(permissionStatus));

        String authorUsername = userRepository.findById(doc.getAuthorId())
                .map(User::getUsername).orElse("Unknown");

        return new DocumentResponse(
                doc.getId(),
                doc.getTitle(),
                doc.getContent(),
                doc.getAuthorId(),
                authorUsername,
                doc.getCreatedAt(),
                doc.getUpdatedAt(),
                isOwner,
                canEdit,
                canRequestAccess,
                permissionStatus
        );
    }

    private DocumentPermissionResponse toPermissionResponse(DocumentPermission perm) {
        String requesterUsername = userRepository.findById(perm.getRequesterId())
                .map(User::getUsername).orElse("Unknown");
        return new DocumentPermissionResponse(
                perm.getId(),
                perm.getRequesterId(),
                requesterUsername,
                perm.getStatus(),
                perm.getCreatedAt()
        );
    }
}
