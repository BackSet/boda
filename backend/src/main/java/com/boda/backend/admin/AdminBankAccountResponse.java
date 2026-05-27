package com.boda.backend.admin;

public record AdminBankAccountResponse(
        Long id,
        String bankName,
        String accountHolder,
        String accountType,
        String accountNumber,
        String clabeIban,
        String accountAlias,
        String notes,
        Integer orderIndex,
        Boolean enabled) {
}
