package com.boda.backend.lovestory;

public record PartnerLoveStoryEntryResponse(
        Long id,
        String eventDate,
        String title,
        String quote,
        String imageUrl,
        Integer sortOrder) {
}
