package com.boda.backend.event;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class WeddingEventService {

    private final WeddingEventRepository repository;

    public WeddingEventService(WeddingEventRepository repository) {
        this.repository = repository;
    }

    @Transactional(readOnly = true)
    public PublicEventResponse getPublicEvent() {
        return toPublicResponse(getOrCreateDefault());
    }

    @Transactional(readOnly = true)
    public AdminEventUpsertRequest getAdminEvent() {
        WeddingEvent event = getOrCreateDefault();
        return new AdminEventUpsertRequest(
                event.getCoupleDisplayName(),
                event.getEventTitle(),
                event.getEventDate(),
                event.getTargetDateIso(),
                event.getCeremonyAddress(),
                event.getReceptionAddress(),
                event.getDressCode());
    }

    @Transactional
    public PublicEventResponse updateEvent(AdminEventUpsertRequest request) {
        WeddingEvent event = getOrCreateDefault();
        event.setCoupleDisplayName(request.coupleDisplayName().trim());
        event.setEventTitle(request.eventTitle().trim());
        event.setEventDate(request.eventDate().trim());
        event.setTargetDateIso(request.targetDateIso().trim());
        event.setCeremonyAddress(request.ceremonyAddress().trim());
        event.setReceptionAddress(request.receptionAddress().trim());
        event.setDressCode(normalizeOptional(request.dressCode()));
        return toPublicResponse(repository.save(event));
    }

    @Transactional
    public WeddingEvent getOrCreateDefault() {
        return repository.findById(1L).orElseGet(() -> {
            WeddingEvent event = new WeddingEvent();
            event.setId(1L);
            event.setCoupleDisplayName("Ana y Daniel");
            event.setEventTitle("Boda de Ana y Daniel");
            event.setEventDate("12 de diciembre de 2026 · 16:00 hrs");
            event.setTargetDateIso("2026-12-12T16:00:00");
            event.setCeremonyAddress("Parroquia de San Miguel, Centro Historico");
            event.setReceptionAddress("Casa Editorial Roma Norte");
            event.setDressCode("Formal elegante · tonos pastel y neutros");
            return repository.save(event);
        });
    }

    private PublicEventResponse toPublicResponse(WeddingEvent event) {
        return new PublicEventResponse(
                event.getCoupleDisplayName(),
                event.getEventTitle(),
                event.getEventDate(),
                event.getTargetDateIso(),
                event.getCeremonyAddress(),
                event.getReceptionAddress(),
                event.getDressCode());
    }

    private String normalizeOptional(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }
        return value.trim();
    }
}
