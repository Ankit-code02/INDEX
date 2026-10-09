
package com.documentintelligence.backend.service;

import com.documentintelligence.backend.entity.Document;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.Map;

@Service
public class SemanticSearchService {

    private final DocumentService documentService;
    private final OllamaEmbeddingService embeddingService;

    public SemanticSearchService(
            DocumentService documentService,
            OllamaEmbeddingService embeddingService) {
        this.documentService = documentService;
        this.embeddingService = embeddingService;
    }

    public List<Map<String, Object>> search(String query, int limit) {
        if (query == null || query.isBlank()) {
            throw new IllegalArgumentException(
                    "Search query must not be empty.");
        }

        if (limit < 1 || limit > 50) {
            throw new IllegalArgumentException(
                    "Limit must be between 1 and 50.");
        }

        List<Double> queryVector =
                embeddingService.generateEmbedding(query);

        return documentService.getAllDocuments().stream()
                .filter(doc -> doc.getEmbeddingJson() != null
                        && !doc.getEmbeddingJson().isBlank())
                .map(doc -> {
                    List<Double> documentVector =
                            parseVector(doc.getEmbeddingJson());

                    double similarity =
                            cosineSimilarity(queryVector, documentVector);

                    return Map.<String, Object>of(
                            "documentId", doc.getId(),
                            "fileName", doc.getFileName(),
                            "similarity",
                            Math.round(similarity * 10000.0) / 10000.0
                    );
                })
                .sorted(Comparator.comparingDouble(
                        result -> -((Number) result.get("similarity"))
                                .doubleValue()))
                .limit(limit)
                .toList();
    }

    private List<Double> parseVector(String json) {
        String value = json.trim();

        if (!value.startsWith("[") || !value.endsWith("]")) {
            throw new IllegalArgumentException(
                    "Stored embedding has an invalid format.");
        }

        String contents = value.substring(1, value.length() - 1).trim();

        if (contents.isEmpty()) {
            return List.of();
        }

        return java.util.Arrays.stream(contents.split(","))
                .map(String::trim)
                .map(Double::parseDouble)
                .toList();
    }

    private double cosineSimilarity(
            List<Double> first,
            List<Double> second) {

        if (first.isEmpty() || first.size() != second.size()) {
            return -1.0;
        }

        double dotProduct = 0.0;
        double firstMagnitude = 0.0;
        double secondMagnitude = 0.0;

        for (int i = 0; i < first.size(); i++) {
            double a = first.get(i);
            double b = second.get(i);

            dotProduct += a * b;
            firstMagnitude += a * a;
            secondMagnitude += b * b;
        }

        if (firstMagnitude == 0.0 || secondMagnitude == 0.0) {
            return -1.0;
        }

        return dotProduct
                / (Math.sqrt(firstMagnitude) * Math.sqrt(secondMagnitude));
    }
}
