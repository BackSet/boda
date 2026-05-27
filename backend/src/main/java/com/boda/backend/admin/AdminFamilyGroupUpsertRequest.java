package com.boda.backend.admin;

import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;

public record AdminFamilyGroupUpsertRequest(
        @NotBlank @Size(max = 160) String displayName,
        @Size(max = 160) String contactEmail,
        @NotEmpty List<@Valid AdminFamilyMemberRequest> members) {
}
