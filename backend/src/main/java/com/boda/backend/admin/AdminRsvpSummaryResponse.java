package com.boda.backend.admin;

public record AdminRsvpSummaryResponse(
        long confirmed,
        long declined,
        long pending,
        long confirmedGuests) {
}
