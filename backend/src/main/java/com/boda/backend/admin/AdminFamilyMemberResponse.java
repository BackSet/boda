package com.boda.backend.admin;

public record AdminFamilyMemberResponse(
        Long id,
        String fullName,
        Integer sortOrder,
        Boolean attending,
        boolean primaryGuest) {
}
