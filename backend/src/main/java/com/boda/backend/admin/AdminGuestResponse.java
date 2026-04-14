package com.boda.backend.admin;

import java.time.Instant;

public record AdminGuestResponse(
        Long id,
        String token,
        String invitationUrl,
        String guestName,
        String guestEmail,
        Integer maxGuests,
        String eventTitle,
        String eventDate,
        String ceremonyAddress,
        String receptionAddress,
        Boolean attending,
        Integer guestCount,
        String dietaryRestrictions,
        String message,
        Instant respondedAt) {
}
