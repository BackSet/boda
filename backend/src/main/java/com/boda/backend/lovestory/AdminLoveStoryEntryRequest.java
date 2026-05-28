package com.boda.backend.lovestory;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record AdminLoveStoryEntryRequest(
        @NotNull LoveStoryAuthor author,
        @NotBlank @Size(max = 40) String eventDate,
        @Size(max = 160) String title,
        @NotBlank @Size(max = 1000) String quote,
        @NotBlank
        @Size(max = 500)
        @Pattern(regexp = "^https?://.+$", message = "La URL de imagen debe iniciar con http o https")
        String imageUrl) {
}
