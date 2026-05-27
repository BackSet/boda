package com.boda.backend.admin;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.boda.backend.event.AdminEventUpsertRequest;
import com.boda.backend.event.PublicEventResponse;
import com.boda.backend.event.WeddingEventService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/admin")
public class AdminEventController {

    private final WeddingEventService weddingEventService;

    public AdminEventController(WeddingEventService weddingEventService) {
        this.weddingEventService = weddingEventService;
    }

    @GetMapping("/event")
    public AdminEventUpsertRequest getEvent() {
        return weddingEventService.getAdminEvent();
    }

    @PutMapping("/event")
    public PublicEventResponse updateEvent(@Valid @RequestBody AdminEventUpsertRequest request) {
        return weddingEventService.updateEvent(request);
    }
}
