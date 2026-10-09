
package com.documentintelligence.backend.controller;

import com.documentintelligence.backend.service.DocumentQaService;
import org.springframework.web.bind.annotation.*;

import java.util.Map;


@RestController
@RequestMapping("/api/qa")
public class DocumentQaController {

    private final DocumentQaService documentQaService;

    public DocumentQaController(DocumentQaService documentQaService) {
        this.documentQaService = documentQaService;
    }

    @PostMapping("/ask")
    public Map<String, Object> ask(
            @RequestBody Map<String, String> request) {

        return documentQaService.ask(request.get("question"));
    }
}

