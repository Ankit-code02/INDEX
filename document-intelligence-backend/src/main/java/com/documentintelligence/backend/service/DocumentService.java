
package com.documentintelligence.backend.service;

import com.documentintelligence.backend.entity.Document;
import com.documentintelligence.backend.repository.DocumentRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DocumentService {

    private final DocumentRepository documentRepository;

    public List<Document> searchDocuments(String keyword) {
        return documentRepository.findByFileNameContainingIgnoreCase(keyword);
    }
    public List<Document> searchByContent(String keyword) {
        return documentRepository
                .findByExtractedTextContainingIgnoreCase(keyword);
    }

    public DocumentService(DocumentRepository documentRepository) {
        this.documentRepository = documentRepository;
    }

    public List<Document> getAllDocuments() {
        return documentRepository.findAll();
    }

    public Document getDocumentById(Long id) {
        return documentRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Document not found with ID: " + id));
    }

    public Document saveDocument(Document document) {
        return documentRepository.save(document);
    }

    public void deleteDocument(Long id) {
        if (!documentRepository.existsById(id)) {
            throw new RuntimeException("Document not found with ID: " + id);
        }

        documentRepository.deleteById(id);
    }
}
