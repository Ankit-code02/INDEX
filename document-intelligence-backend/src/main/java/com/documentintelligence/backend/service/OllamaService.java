
package com.documentintelligence.backend.service;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.Map;

@Service
public class OllamaService {

    private final RestClient restClient;

    public OllamaService() {
        this.restClient = RestClient.builder()
                .baseUrl("http://localhost:11434")
                .build();
    }

    public String generateSummary(String text) {
        Map<String, Object> request = Map.of(
                "model", "llama3.2",
                "prompt", "Summarize the following document clearly and concisely. "
                        + "Use only the provided content:\n\n" + text,
                "stream", false
        );

        Map<?, ?> response = restClient.post()
                .uri("/api/generate")
                .body(request)
                .retrieve()
                .body(Map.class);

        if (response == null || response.get("response") == null) {
            throw new IllegalStateException("Ollama returned an empty response.");
        }

        return response.get("response").toString();
    }
}

