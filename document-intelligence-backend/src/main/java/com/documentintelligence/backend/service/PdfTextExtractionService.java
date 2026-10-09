
package com.documentintelligence.backend.service;

import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.Path;

@Service
public class PdfTextExtractionService {

    public String extractText(String storedFileName) throws IOException {
        Path filePath = Path.of("uploads", storedFileName)
                .toAbsolutePath()
                .normalize();

        if (!filePath.startsWith(Path.of("uploads").toAbsolutePath().normalize())) {
            throw new IllegalArgumentException("Invalid file path.");
        }

        try (PDDocument document = Loader.loadPDF(filePath.toFile())) {
            return new PDFTextStripper().getText(document);
        }
    }
}
