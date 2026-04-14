package com.boda.backend.invitation;

import java.time.Instant;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class InvitationService {

    private final GuestInvitationRepository repository;

    public InvitationService(GuestInvitationRepository repository) {
        this.repository = repository;
    }

    @Transactional(readOnly = true)
    public InvitationResponse getInvitationByToken(String token) {
        GuestInvitation invitation = repository.findByToken(token)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Token de invitacion no valido"));
        return toResponse(invitation);
    }

    @Transactional
    public void submitRsvp(RsvpRequest request) {
        GuestInvitation invitation = repository.findByToken(request.token())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Token de invitacion no valido"));

        if (Boolean.TRUE.equals(request.attending())) {
            if (request.guestCount() < 1 || request.guestCount() > invitation.getMaxGuests()) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Numero de asistentes fuera del rango permitido");
            }
        } else if (request.guestCount() != 0) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Si no asistira, guestCount debe ser 0");
        }

        invitation.setAttending(request.attending());
        invitation.setGuestCount(request.guestCount());
        invitation.setDietaryRestrictions(request.dietaryRestrictions());
        invitation.setMessage(request.message());
        invitation.setRespondedAt(Instant.now());

        repository.save(invitation);
    }

    private InvitationResponse toResponse(GuestInvitation invitation) {
        return new InvitationResponse(
                invitation.getToken(),
                invitation.getGuestName(),
                invitation.getGuestEmail(),
                invitation.getMaxGuests(),
                invitation.getAttending(),
                invitation.getGuestCount(),
                invitation.getDietaryRestrictions(),
                invitation.getMessage(),
                invitation.getEventTitle(),
                invitation.getEventDate(),
                invitation.getCeremonyAddress(),
                invitation.getReceptionAddress());
    }
}
