package com.blaze.backend.repository;

import com.blaze.backend.entity.DocumentPermission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DocumentPermissionRepository extends JpaRepository<DocumentPermission, Long> {
    Optional<DocumentPermission> findByDocumentIdAndRequesterId(Long documentId, Long requesterId);
    List<DocumentPermission> findByDocumentId(Long documentId);
}
