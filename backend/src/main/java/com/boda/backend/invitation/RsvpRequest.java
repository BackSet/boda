package com.boda.backend.invitation;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record RsvpRequest(
        @NotBlank String token,
        @NotNull Boolean attending,
        @NotNull @Min(0) @Max(10) Integer guestCount,
        @Size(max = 500) String dietaryRestrictions,
        @Size(max = 1000) String message) {
}
