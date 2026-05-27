package com.boda.backend.lovestory;

import java.util.List;

public record PublicLoveStoryResponse(
        String title,
        String subtitle,
        List<PublicLoveStoryEntryResponse> entries) {
}
