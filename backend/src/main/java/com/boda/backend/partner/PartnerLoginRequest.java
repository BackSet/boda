package com.boda.backend.partner;

import jakarta.validation.constraints.NotBlank;

public record PartnerLoginRequest(
        @NotBlank String username,
        @NotBlank String password) {
}
