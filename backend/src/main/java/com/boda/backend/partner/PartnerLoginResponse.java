package com.boda.backend.partner;

import com.boda.backend.lovestory.LoveStoryAuthor;

public record PartnerLoginResponse(
        String token,
        long expiresAt,
        LoveStoryAuthor author,
        String displayName) {
}
