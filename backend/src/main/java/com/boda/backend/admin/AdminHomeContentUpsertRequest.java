package com.boda.backend.admin;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record AdminHomeContentUpsertRequest(
        @NotBlank @Size(max = 60) String sectionType,
        @NotBlank @Size(max = 160) String title,
        @Size(max = 280) String subtitle,
        @Size(max = 2000) String body,
        @Size(max = 5000) String payloadJson,
        @NotNull Integer orderIndex,
        @NotNull Boolean enabled) {
}
