package com.boda.backend.event;

public record PublicEventResponse(
        String coupleDisplayName,
        String eventTitle,
        String eventDate,
        String targetDateIso,
        String ceremonyAddress,
        String receptionAddress,
        String dressCode) {
}
