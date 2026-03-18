package com.blaze.backend.service;

import com.blaze.backend.dto.DocumentRequest;
import com.blaze.backend.entity.Document;
import com.blaze.backend.repository.DocumentRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DocumentService {

    private final DocumentRepository documentRepository;

    public DocumentService(DocumentRepository documentRepository) {
        this.documentRepository = documentRepository;
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

    public Document updateDocument(Long id, DocumentRequest request, Long requesterId) {
        Document document = getDocumentById(id);

        if (!document.getAuthorId().equals(requesterId)) {
            throw new RuntimeException("Unauthorized");
        }

        document.setTitle(request.getTitle());
        document.setContent(request.getContent());
        return documentRepository.save(document);
    }

    public void deleteDocument(Long id, Long requesterId) {
        Document document = getDocumentById(id);

        if (!document.getAuthorId().equals(requesterId)) {
            throw new RuntimeException("Unauthorized");
        }

        documentRepository.delete(document);
    }
}
