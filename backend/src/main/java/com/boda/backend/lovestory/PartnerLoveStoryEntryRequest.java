package com.boda.backend.lovestory;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record PartnerLoveStoryEntryRequest(
        @NotBlank @Size(max = 40) String eventDate,
        @Size(max = 160) String title,
        @NotBlank @Size(max = 1000) String quote,
        @NotBlank @Size(max = 500) String imageUrl) {
}
