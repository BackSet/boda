package com.boda.backend.admin;

public record AdminHomeContentResponse(
        Long id,
        String sectionType,
        String title,
        String subtitle,
        String body,
        String payloadJson,
        Integer orderIndex,
        Boolean enabled) {
}
