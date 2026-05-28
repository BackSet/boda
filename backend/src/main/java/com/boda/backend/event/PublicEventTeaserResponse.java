package com.boda.backend.event;

public record PublicEventTeaserResponse(
        String coupleDisplayName,
        String eventTitle,
        String eventDate,
        String targetDateIso,
        String cityLabel) {
}
