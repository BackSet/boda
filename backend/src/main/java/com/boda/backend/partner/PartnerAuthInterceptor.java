package com.boda.backend.partner;

import java.io.IOException;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import com.boda.backend.lovestory.LoveStoryAuthor;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class PartnerAuthInterceptor implements HandlerInterceptor {

    public static final String PARTNER_AUTHOR_ATTRIBUTE = "partnerAuthor";

    private final PartnerSessionService partnerSessionService;

    public PartnerAuthInterceptor(PartnerSessionService partnerSessionService) {
        this.partnerSessionService = partnerSessionService;
    }

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)
            throws Exception {
        String path = request.getRequestURI();
        if (!path.startsWith("/api/partner") || path.equals("/api/partner/login")
                || "OPTIONS".equalsIgnoreCase(request.getMethod())) {
            return true;
        }

        String authorization = request.getHeader("Authorization");
        if (authorization == null || !authorization.startsWith("Bearer ")) {
            writeUnauthorized(response, "Falta token de sesion de pareja");
            return false;
        }

        String token = authorization.substring("Bearer ".length()).trim();
        LoveStoryAuthor author = partnerSessionService.resolveAuthorFromToken(token);
        if (author == null) {
            writeUnauthorized(response, "Token de pareja invalido o expirado");
            return false;
        }

        request.setAttribute(PARTNER_AUTHOR_ATTRIBUTE, author);
        return true;
    }

    private void writeUnauthorized(HttpServletResponse response, String message) throws IOException {
        response.setStatus(HttpStatus.UNAUTHORIZED.value());
        response.setContentType(MediaType.TEXT_PLAIN_VALUE);
        response.getWriter().write(message);
    }
}
