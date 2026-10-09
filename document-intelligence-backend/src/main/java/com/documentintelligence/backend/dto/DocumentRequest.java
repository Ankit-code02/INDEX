
package com.documentintelligence.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

public record DocumentRequest(
        @NotBlank String fileName,
        String contentType,
        @NotNull @PositiveOrZero Long fileSize
) {
}
