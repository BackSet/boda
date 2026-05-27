package com.boda.backend.lovestory;

public record PublicLoveStoryEntryResponse(
        Long id,
        String author,
        String authorDisplayName,
        String eventDate,
        String title,
        String quote,
        String imageUrl,
        Integer sortOrder) {
}
