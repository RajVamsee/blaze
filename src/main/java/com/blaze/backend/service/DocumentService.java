package com.blaze.backend.service;

import com.blaze.backend.dto.DocumentRequest;
import com.blaze.backend.entity.Document;
import com.blaze.backend.entity.DocumentPermission;
import com.blaze.backend.repository.DocumentPermissionRepository;
import com.blaze.backend.repository.DocumentRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DocumentService {

    private final DocumentRepository documentRepository;
    private final DocumentPermissionRepository permissionRepository;

    public DocumentService(DocumentRepository documentRepository,
                           DocumentPermissionRepository permissionRepository) {
        this.documentRepository = documentRepository;
        this.permissionRepository = permissionRepository;
    }

    public Document createDocument(DocumentRequest request, Long authorId) {
        Document document = new Document();
        document.setTitle(request.getTitle());
        document.setContent(request.getContent());
        document.setAuthorId(authorId);
        return documentRepository.save(document);
    }

    public List<Document> getAllDocuments() {
        return documentRepository.findAll();
    }

    public Document getDocumentById(Long id) {
        return documentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Document not found with id: " + id));
    }

    public Document updateDocument(Long id, DocumentRequest request, Long requesterId, boolean isAdmin) {
        Document document = getDocumentById(id);
        boolean isOwner = document.getAuthorId().equals(requesterId);
        boolean hasApproved = permissionRepository
                .findByDocumentIdAndRequesterId(id, requesterId)
                .map(p -> "APPROVED".equals(p.getStatus()))
                .orElse(false);

        if (!isAdmin && !isOwner && !hasApproved) {
            throw new RuntimeException("Unauthorized: you do not have edit access to this document.");
        }

        document.setTitle(request.getTitle());
        document.setContent(request.getContent());
        return documentRepository.save(document);
    }

    public void deleteDocument(Long id, Long requesterId, boolean isAdmin) {
        Document document = getDocumentById(id);
        if (!isAdmin && !document.getAuthorId().equals(requesterId)) {
            throw new RuntimeException("Unauthorized: only the owner or admin can delete this document.");
        }
        documentRepository.delete(document);
    }

    public DocumentPermission requestAccess(Long documentId, Long requesterId) {
        Document doc = getDocumentById(documentId);
        if (doc.getAuthorId().equals(requesterId)) {
            throw new RuntimeException("You are already the owner of this document.");
        }
        Optional<DocumentPermission> existing =
                permissionRepository.findByDocumentIdAndRequesterId(documentId, requesterId);
        if (existing.isPresent()) {
            DocumentPermission perm = existing.get();
            if ("APPROVED".equals(perm.getStatus())) {
                throw new RuntimeException("You already have edit access.");
            }
            if ("PENDING".equals(perm.getStatus())) {
                throw new RuntimeException("Your request is already pending approval.");
            }
            // DENIED — allow re-request
            perm.setStatus("PENDING");
            return permissionRepository.save(perm);
        }
        DocumentPermission perm = new DocumentPermission();
        perm.setDocumentId(documentId);
        perm.setRequesterId(requesterId);
        perm.setStatus("PENDING");
        return permissionRepository.save(perm);
    }

    public List<DocumentPermission> getPermissions(Long documentId, Long requesterId) {
        Document doc = getDocumentById(documentId);
        if (!doc.getAuthorId().equals(requesterId)) {
            throw new RuntimeException("Unauthorized: only the document owner can view access requests.");
        }
        return permissionRepository.findByDocumentId(documentId);
    }

    public DocumentPermission updatePermissionStatus(Long documentId, Long permissionId,
                                                     String status, Long requesterId) {
        Document doc = getDocumentById(documentId);
        if (!doc.getAuthorId().equals(requesterId)) {
            throw new RuntimeException("Unauthorized: only the document owner can manage access requests.");
        }
        DocumentPermission perm = permissionRepository.findById(permissionId)
                .orElseThrow(() -> new RuntimeException("Permission request not found."));
        if (!perm.getDocumentId().equals(documentId)) {
            throw new RuntimeException("Permission does not belong to this document.");
        }
        perm.setStatus(status);
        return permissionRepository.save(perm);
    }

    public Optional<DocumentPermission> getPermissionForUser(Long documentId, Long userId) {
        return permissionRepository.findByDocumentIdAndRequesterId(documentId, userId);
    }
}
