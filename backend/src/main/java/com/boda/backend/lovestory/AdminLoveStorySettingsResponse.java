package com.boda.backend.lovestory;

public record AdminLoveStorySettingsResponse(
        boolean enabled,
        boolean published,
        String sectionTitle,
        String sectionSubtitle,
        String partnerADisplayName,
        String partnerBDisplayName,
        long partnerAEntryCount,
        long partnerBEntryCount) {
}
