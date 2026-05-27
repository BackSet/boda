package com.boda.backend.admin;

public record AdminRsvpSummaryResponse(
        long guestsAttending,
        long guestsDeclined,
        long groupsResponded,
        long groupsPending) {
}
