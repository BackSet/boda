package com.boda.backend.admin;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.boda.backend.invitation.GuestInvitation;
import com.boda.backend.invitation.GuestInvitationRepository;

@Service
public class AdminGuestService {

    private final GuestInvitationRepository repository;
    private final String frontendBaseUrl;

    public AdminGuestService(
            GuestInvitationRepository repository,
            @Value("${app.frontend.base-url}") String frontendBaseUrl) {
        this.repository = repository;
        this.frontendBaseUrl = frontendBaseUrl;
    }

    @Transactional(readOnly = true)
    public List<AdminGuestResponse> listGuests() {
        return repository.findAll(Sort.by(Sort.Direction.DESC, "id")).stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public AdminGuestResponse createGuest(AdminGuestUpsertRequest request) {
        GuestInvitation invitation = new GuestInvitation();
        invitation.setToken(generateUniqueToken());
        applyUpsert(request, invitation);
        return toResponse(repository.save(invitation));
    }

    @Transactional
    public AdminGuestResponse updateGuest(Long id, AdminGuestUpsertRequest request) {
        GuestInvitation invitation = repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Invitado no encontrado"));
        applyUpsert(request, invitation);
        return toResponse(repository.save(invitation));
    }

    @Transactional
    public void deleteGuest(Long id) {
        GuestInvitation invitation = repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Invitado no encontrado"));
        repository.delete(invitation);
    }

    @Transactional(readOnly = true)
    public AdminRsvpSummaryResponse getRsvpSummary() {
        return new AdminRsvpSummaryResponse(
                repository.countByAttendingTrue(),
                repository.countByAttendingFalse(),
                repository.countByAttendingIsNull(),
                repository.sumGuestCountForAttending());
    }

    private void applyUpsert(AdminGuestUpsertRequest request, GuestInvitation invitation) {
        invitation.setGuestName(request.guestName().trim());
        invitation.setGuestEmail(normalizeOptional(request.guestEmail()));
        invitation.setMaxGuests(request.maxGuests() == null ? 1 : request.maxGuests());
        invitation.setEventTitle(request.eventTitle().trim());
        invitation.setEventDate(request.eventDate().trim());
        invitation.setCeremonyAddress(request.ceremonyAddress().trim());
        invitation.setReceptionAddress(request.receptionAddress().trim());
    }

    private String normalizeOptional(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }
        return value.trim();
    }

    private String generateUniqueToken() {
        String token;
        do {
            token = UUID.randomUUID().toString().replace("-", "").substring(0, 12);
        } while (repository.existsByToken(token));
        return token;
    }

    private AdminGuestResponse toResponse(GuestInvitation invitation) {
        String baseUrl = frontendBaseUrl.endsWith("/") ? frontendBaseUrl.substring(0, frontendBaseUrl.length() - 1)
                : frontendBaseUrl;
        String invitationUrl = baseUrl + "/invitacion/" + invitation.getToken();

        return new AdminGuestResponse(
                invitation.getId(),
                invitation.getToken(),
                invitationUrl,
                invitation.getGuestName(),
                invitation.getGuestEmail(),
                invitation.getMaxGuests(),
                invitation.getEventTitle(),
                invitation.getEventDate(),
                invitation.getCeremonyAddress(),
                invitation.getReceptionAddress(),
                invitation.getAttending(),
                invitation.getGuestCount(),
                invitation.getDietaryRestrictions(),
                invitation.getMessage(),
                invitation.getRespondedAt());
    }
}
