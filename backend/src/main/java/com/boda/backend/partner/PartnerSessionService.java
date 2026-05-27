package com.boda.backend.partner;

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

import com.boda.backend.lovestory.LoveStoryAuthor;

@Service
public class PartnerSessionService {

    private final String partnerAUsername;
    private final String partnerAPassword;
    private final String partnerADisplayName;
    private final String partnerBUsername;
    private final String partnerBPassword;
    private final String partnerBDisplayName;
    private final String sessionSecret;
    private final Duration sessionDuration;

    public PartnerSessionService(
            @Value("${app.partner-a.username}") String partnerAUsername,
            @Value("${app.partner-a.password}") String partnerAPassword,
            @Value("${app.partner-a.display-name:Partner A}") String partnerADisplayName,
            @Value("${app.partner-b.username}") String partnerBUsername,
            @Value("${app.partner-b.password}") String partnerBPassword,
            @Value("${app.partner-b.display-name:Partner B}") String partnerBDisplayName,
            @Value("${app.admin.session-secret}") String sessionSecret,
            @Value("${app.admin.session-minutes:480}") long sessionMinutes) {
        this.partnerAUsername = partnerAUsername;
        this.partnerAPassword = partnerAPassword;
        this.partnerADisplayName = partnerADisplayName;
        this.partnerBUsername = partnerBUsername;
        this.partnerBPassword = partnerBPassword;
        this.partnerBDisplayName = partnerBDisplayName;
        this.sessionSecret = sessionSecret;
        this.sessionDuration = Duration.ofMinutes(sessionMinutes);
    }

    public PartnerLoginResponse login(PartnerLoginRequest request) {
        LoveStoryAuthor author = resolveAuthor(request.username(), request.password());
        if (author == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Credenciales invalidas");
        }

        long expiresAt = Instant.now().plus(sessionDuration).toEpochMilli();
        String roleKey = author == LoveStoryAuthor.PARTNER_A ? "partnerA" : "partnerB";
        String payload = roleKey + ":" + expiresAt;
        String payloadPart = Base64.getUrlEncoder().withoutPadding()
                .encodeToString(payload.getBytes(StandardCharsets.UTF_8));
        String signaturePart = Base64.getUrlEncoder().withoutPadding().encodeToString(sign(payload));

        return new PartnerLoginResponse(
                payloadPart + "." + signaturePart,
                expiresAt,
                author,
                displayNameFor(author));
    }

    public LoveStoryAuthor resolveAuthorFromToken(String token) {
        if (token == null || token.isBlank() || !token.contains(".")) {
            return null;
        }
        String[] parts = token.split("\\.");
        if (parts.length != 2) {
            return null;
        }

        try {
            String payload = new String(Base64.getUrlDecoder().decode(parts[0]), StandardCharsets.UTF_8);
            byte[] providedSignature = Base64.getUrlDecoder().decode(parts[1]);
            if (!MessageDigest.isEqual(providedSignature, sign(payload))) {
                return null;
            }

            String[] payloadParts = payload.split(":");
            if (payloadParts.length != 2) {
                return null;
            }
            long expiresAt = Long.parseLong(payloadParts[1]);
            if (Instant.now().toEpochMilli() >= expiresAt) {
                return null;
            }

            return switch (payloadParts[0]) {
                case "partnerA" -> LoveStoryAuthor.PARTNER_A;
                case "partnerB" -> LoveStoryAuthor.PARTNER_B;
                default -> null;
            };
        } catch (Exception exception) {
            return null;
        }
    }

    public boolean isTokenValid(String token) {
        return resolveAuthorFromToken(token) != null;
    }

    public String displayNameFor(LoveStoryAuthor author) {
        return author == LoveStoryAuthor.PARTNER_A ? partnerADisplayName : partnerBDisplayName;
    }

    private LoveStoryAuthor resolveAuthor(String username, String password) {
        if (partnerAUsername.equals(username) && partnerAPassword.equals(password)) {
            return LoveStoryAuthor.PARTNER_A;
        }
        if (partnerBUsername.equals(username) && partnerBPassword.equals(password)) {
            return LoveStoryAuthor.PARTNER_B;
        }
        return null;
    }

    private byte[] sign(String payload) {
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            SecretKeySpec keySpec = new SecretKeySpec(sessionSecret.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
            mac.init(keySpec);
            return mac.doFinal(payload.getBytes(StandardCharsets.UTF_8));
        } catch (Exception exception) {
            throw new IllegalStateException("No se pudo firmar token de pareja", exception);
        }
    }
}
