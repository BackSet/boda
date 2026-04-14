package com.boda.backend.admin;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record AdminGuestUpsertRequest(
        @NotBlank @Size(max = 140) String guestName,
        @Size(max = 160) String guestEmail,
        @Min(1) @Max(10) Integer maxGuests,
        @NotBlank @Size(max = 160) String eventTitle,
        @NotBlank @Size(max = 120) String eventDate,
        @NotBlank @Size(max = 220) String ceremonyAddress,
        @NotBlank @Size(max = 220) String receptionAddress) {
}
