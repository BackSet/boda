package com.boda.backend.admin;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record AdminFamilyMemberRequest(
        @NotBlank @Size(max = 140) String fullName,
        boolean primaryGuest) {
}
