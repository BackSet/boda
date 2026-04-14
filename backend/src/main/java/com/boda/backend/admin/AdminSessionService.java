package com.boda.backend.admin;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.Duration;
import java.time.Instant;
import java.util.Base64;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AdminSessionService {

    private final String adminUsername;
    private final String adminPassword;
    private final String sessionSecret;
    private final Duration sessionDuration;

    public AdminSessionService(
            @Value("${app.admin.username}") String adminUsername,
            @Value("${app.admin.password}") String adminPassword,
            @Value("${app.admin.session-secret}") String sessionSecret,
            @Value("${app.admin.session-minutes:480}") long sessionMinutes) {
        this.adminUsername = adminUsername;
        this.adminPassword = adminPassword;
        this.sessionSecret = sessionSecret;
        this.sessionDuration = Duration.ofMinutes(sessionMinutes);
    }

    public AdminLoginResponse login(AdminLoginRequest request) {
        if (!adminUsername.equals(request.username()) || !adminPassword.equals(request.password())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Credenciales invalidas");
        }

        long expiresAt = Instant.now().plus(sessionDuration).toEpochMilli();
        String payload = request.username() + ":" + expiresAt;
        String payloadPart = Base64.getUrlEncoder().withoutPadding()
                .encodeToString(payload.getBytes(StandardCharsets.UTF_8));
        String signaturePart = Base64.getUrlEncoder().withoutPadding().encodeToString(sign(payload));

        return new AdminLoginResponse(payloadPart + "." + signaturePart, expiresAt);
    }

    public boolean isTokenValid(String token) {
        if (token == null || token.isBlank() || !token.contains(".")) {
            return false;
        }
        String[] parts = token.split("\\.");
        if (parts.length != 2) {
            return false;
        }

        try {
            String payload = new String(Base64.getUrlDecoder().decode(parts[0]), StandardCharsets.UTF_8);
            byte[] providedSignature = Base64.getUrlDecoder().decode(parts[1]);
            byte[] expectedSignature = sign(payload);

            if (!MessageDigest.isEqual(providedSignature, expectedSignature)) {
                return false;
            }

            String[] payloadParts = payload.split(":");
            if (payloadParts.length != 2) {
                return false;
            }
            String username = payloadParts[0];
            long expiresAt = Long.parseLong(payloadParts[1]);

            return adminUsername.equals(username) && Instant.now().toEpochMilli() < expiresAt;
        } catch (Exception exception) {
            return false;
        }
    }

    private byte[] sign(String payload) {
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            SecretKeySpec keySpec = new SecretKeySpec(sessionSecret.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
            mac.init(keySpec);
            return mac.doFinal(payload.getBytes(StandardCharsets.UTF_8));
        } catch (Exception exception) {
            throw new IllegalStateException("No se pudo firmar token admin", exception);
        }
    }
}
