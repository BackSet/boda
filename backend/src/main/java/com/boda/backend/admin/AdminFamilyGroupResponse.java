package com.boda.backend.admin;

import java.time.Instant;
import java.util.List;

public record AdminFamilyGroupResponse(
        Long id,
        String token,
        String invitationUrl,
        String displayName,
        String contactEmail,
        String dietaryRestrictions,
        String message,
        Instant respondedAt,
        List<AdminFamilyMemberResponse> members) {
}
