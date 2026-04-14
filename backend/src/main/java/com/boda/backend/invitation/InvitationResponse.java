package com.boda.backend.invitation;

public record InvitationResponse(
        String token,
        String guestName,
        String guestEmail,
        Integer maxGuests,
        Boolean attending,
        Integer guestCount,
        String dietaryRestrictions,
        String message,
        String eventTitle,
        String eventDate,
        String ceremonyAddress,
        String receptionAddress) {
}
