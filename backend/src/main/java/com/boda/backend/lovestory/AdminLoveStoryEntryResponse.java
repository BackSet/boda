package com.boda.backend.lovestory;

public record AdminLoveStoryEntryResponse(
        Long id,
        LoveStoryAuthor author,
        String authorDisplayName,
        String eventDate,
        String title,
        String quote,
        String imageUrl,
        Integer sortOrder) {
}
