package com.boda.backend.event;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record AdminEventUpsertRequest(
        @NotBlank @Size(max = 120) String coupleDisplayName,
        @NotBlank @Size(max = 160) String eventTitle,
        @NotBlank @Size(max = 120) String eventDate,
        @NotBlank @Size(max = 40) String targetDateIso,
        @NotBlank @Size(max = 220) String ceremonyAddress,
        @NotBlank @Size(max = 220) String receptionAddress,
        @Size(max = 500) String ceremonyMapUrl,
        @Size(max = 500) String receptionMapUrl,
        @Size(max = 280) String dressCode,
        @Size(max = 120) String cityLabel) {
}
