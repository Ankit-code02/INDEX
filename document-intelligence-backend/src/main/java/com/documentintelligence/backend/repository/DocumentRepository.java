
package com.documentintelligence.backend.repository;

import com.documentintelligence.backend.entity.Document;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DocumentRepository extends JpaRepository<Document, Long> {

    List<Document> findByFileNameContainingIgnoreCase(String fileName);
    List<Document> findByExtractedTextContainingIgnoreCase(String keyword);
}
