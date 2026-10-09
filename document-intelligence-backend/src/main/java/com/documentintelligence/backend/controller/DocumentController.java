
package com.documentintelligence.backend.controller;

import com.documentintelligence.backend.dto.DocumentRequest;
import com.documentintelligence.backend.entity.Document;
import com.documentintelligence.backend.service.*;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.documentintelligence.backend.service.SemanticSearchService;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/documents")
public class DocumentController {

    private final DocumentService documentService;
    private final DocumentStorageService storageService;
    private final PdfTextExtractionService pdfTextExtractionService;
    private final OllamaService ollamaService;
    private final OllamaEmbeddingService ollamaEmbeddingService;
    private final SemanticSearchService semanticSearchService;


    public DocumentController(
            DocumentService documentService,
            DocumentStorageService storageService,
            PdfTextExtractionService pdfTextExtractionService,
            OllamaService ollamaService,
            OllamaEmbeddingService ollamaEmbeddingService,
            SemanticSearchService semanticSearchService
    )
    {

        this.documentService = documentService;
        this.storageService = storageService;
        this.pdfTextExtractionService = pdfTextExtractionService;
        this.ollamaService = ollamaService;
        this.ollamaEmbeddingService = ollamaEmbeddingService;
        this.semanticSearchService = semanticSearchService;
    }


    @GetMapping
    public List<Document> getAllDocuments() {
        return documentService.getAllDocuments();
    }

    @GetMapping("/{id}")
    public Document getDocumentById(@PathVariable Long id) {
        return documentService.getDocumentById(id);
    }
    @GetMapping("/search")
    public List<Document> searchDocuments(@RequestParam String keyword) {
        return documentService.searchDocuments(keyword);
    }
    @GetMapping("/search/content")
    public List<Document> searchByContent(@RequestParam String keyword) {
        return documentService.searchByContent(keyword);
    }
    @GetMapping("/search/semantic")
    public List<Map<String, Object>> searchSemantic(
            @RequestParam String query,
            @RequestParam(defaultValue = "5") int limit) {

        return semanticSearchService.search(query, limit);
    }

    @PostMapping("/{id}/summarize")
    public Map<String, Object> summarizeDocument(@PathVariable Long id) {
        Document document = documentService.getDocumentById(id);

        if (document.getExtractedText() == null
                || document.getExtractedText().isBlank()) {
            throw new IllegalArgumentException(
                    "Extract text from the document before summarizing."
            );
        }

        String summary = ollamaService.generateSummary(
                document.getExtractedText()
        );

        return Map.of(
                "documentId", document.getId(),
                "fileName", document.getFileName(),
                "summary", summary
        );
    }


    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Document createDocument(@Valid @RequestBody DocumentRequest request) {
        Document document = new Document();
        document.setFileName(request.fileName());
        document.setContentType(request.contentType());
        document.setFileSize(request.fileSize());

        return documentService.saveDocument(document);
    }


    @PostMapping("/upload")
    @ResponseStatus(HttpStatus.CREATED)
    public Document uploadDocument(
            @RequestParam("file") MultipartFile file) throws IOException {

        String storedName = storageService.store(file);

        Document document = new Document();
        document.setFileName(file.getOriginalFilename());
        document.setStoredFileName(storedName);
        document.setContentType(file.getContentType());
        document.setFileSize(file.getSize());

        return documentService.saveDocument(document);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteDocument(@PathVariable Long id) {
        documentService.deleteDocument(id);
    }


    @PostMapping("/{id}/extract")
    public Document extractPdfText(@PathVariable Long id) throws IOException {
        Document document = documentService.getDocumentById(id);

        if (document.getStoredFileName() == null
                || document.getFileName() == null
                || !document.getFileName().toLowerCase().endsWith(".pdf")) {
            throw new IllegalArgumentException("Document must be an uploaded PDF.");
        }

        String text = pdfTextExtractionService.extractText(
                document.getStoredFileName()
        );

        document.setExtractedText(text);

        if (!text.isBlank()) {
            var embedding = ollamaEmbeddingService.generateEmbedding(text);
            document.setEmbeddingJson(ollamaEmbeddingService.toJson(embedding));
        }

        return documentService.saveDocument(document);
    }


}
