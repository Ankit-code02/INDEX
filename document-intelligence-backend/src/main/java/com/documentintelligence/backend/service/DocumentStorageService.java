
package com.documentintelligence.backend.service;

import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.Set;
import java.util.UUID;

@Service
public class DocumentStorageService {

    private final Path storageLocation =
            Paths.get("uploads").toAbsolutePath().normalize();

    private static final Set<String> ALLOWED_TYPES = Set.of(
            "application/pdf",
            "text/plain"
    );

    public DocumentStorageService() throws IOException {
        Files.createDirectories(storageLocation);
    }

    public String store(MultipartFile file) throws IOException {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Please select a non-empty file.");
        }

        String contentType = file.getContentType();

        if (contentType == null || !ALLOWED_TYPES.contains(contentType)) {
            throw new IllegalArgumentException("Only PDF and TXT files are allowed.");
        }

        String originalName = StringUtils.cleanPath(
                file.getOriginalFilename() == null
                        ? "document"
                        : file.getOriginalFilename()
        );

        if (originalName.contains("..") || originalName.contains("/")
                || originalName.contains("\\")) {
            throw new IllegalArgumentException("Invalid file name.");
        }

        String storedName = UUID.randomUUID() + "_" + originalName;
        Path destination = storageLocation.resolve(storedName).normalize();

        if (!destination.startsWith(storageLocation)) {
            throw new IllegalArgumentException("Invalid file path.");
        }

        Files.copy(file.getInputStream(), destination,
                StandardCopyOption.REPLACE_EXISTING);

        return storedName;
    }
}
