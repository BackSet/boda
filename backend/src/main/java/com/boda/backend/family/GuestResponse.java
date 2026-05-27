package com.boda.backend.family;

public record GuestResponse(
        Long id,
        String fullName,
        Integer sortOrder,
        Boolean attending,
        boolean primaryGuest) {
}
