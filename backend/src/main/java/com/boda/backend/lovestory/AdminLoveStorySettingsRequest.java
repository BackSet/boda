package com.boda.backend.lovestory;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record AdminLoveStorySettingsRequest(
        @NotNull Boolean enabled,
        @NotNull Boolean published,
        @NotBlank @Size(max = 160) String sectionTitle,
        @Size(max = 280) String sectionSubtitle) {
}
