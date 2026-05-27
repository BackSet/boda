package com.boda.backend.admin;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record AdminBankAccountUpsertRequest(
        @NotBlank @Size(max = 120) String bankName,
        @NotBlank @Size(max = 160) String accountHolder,
        @NotBlank @Size(max = 80) String accountType,
        @NotBlank @Size(max = 120) String accountNumber,
        @Size(max = 120) String clabeIban,
        @Size(max = 120) String accountAlias,
        @Size(max = 600) String notes,
        @NotNull Integer orderIndex,
        @NotNull Boolean enabled) {
}
