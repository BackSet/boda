package com.boda.backend.content;

public record PublicHomeContentResponse(
        Long id,
        String sectionType,
        String title,
        String subtitle,
        String body,
        String payloadJson,
        Integer orderIndex) {
}
