package com.boda.backend.content;

public record PublicBankAccountResponse(
        Long id,
        String bankName,
        String accountHolder,
        String accountType,
        String accountNumber,
        String clabeIban,
        String accountAlias,
        String notes,
        Integer orderIndex) {
}
