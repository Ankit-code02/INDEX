
package com.documentintelligence.backend.service;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.List;
import java.util.Map;

@Service
public class OllamaEmbeddingService {

    private final RestClient restClient;

    public OllamaEmbeddingService() {
        this.restClient = RestClient.builder()
                .baseUrl("http://localhost:11434")
                .build();
    }

    public List<Double> generateEmbedding(String text) {
        Map<String, Object> request = Map.of(
                "model", "nomic-embed-text",
                "input", text
        );

        Map<?, ?> response = restClient.post()
                .uri("/api/embed")
                .body(request)
                .retrieve()
                .body(Map.class);

        if (response == null || !(response.get("embeddings") instanceof List<?> embeddings)
                || embeddings.isEmpty()
                || !(embeddings.get(0) instanceof List<?> vector)) {
            throw new IllegalStateException("Ollama returned no embeddings.");
        }

        return vector.stream()
                .map(value -> ((Number) value).doubleValue())
                .toList();
    }

    public String toJson(List<Double> embedding) {
        return embedding.stream()
                .map(String::valueOf)
                .collect(java.util.stream.Collectors.joining(",", "[", "]"));
    }
}
