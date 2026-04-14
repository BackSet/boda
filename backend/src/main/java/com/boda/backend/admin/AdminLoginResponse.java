package com.boda.backend.admin;

public record AdminLoginResponse(
        String token,
        long expiresAtEpochMs) {
}
