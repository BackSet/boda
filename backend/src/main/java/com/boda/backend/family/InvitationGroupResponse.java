package com.boda.backend.family;

import java.time.Instant;

public record InvitationGroupResponse(
        String token,
        String displayName,
        String contactEmail,
        String dietaryRestrictions,
        String message,
        Instant respondedAt) {
}
