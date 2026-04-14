package com.boda.backend.admin;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/admin")
@Validated
public class AdminGuestController {

    private final AdminGuestService adminGuestService;

    public AdminGuestController(AdminGuestService adminGuestService) {
        this.adminGuestService = adminGuestService;
    }

    @GetMapping("/guests")
    public List<AdminGuestResponse> listGuests() {
        return adminGuestService.listGuests();
    }

    @PostMapping("/guests")
    public AdminGuestResponse createGuest(@Valid @RequestBody AdminGuestUpsertRequest request) {
        return adminGuestService.createGuest(request);
    }

    @PutMapping("/guests/{id}")
    public AdminGuestResponse updateGuest(@PathVariable Long id, @Valid @RequestBody AdminGuestUpsertRequest request) {
        return adminGuestService.updateGuest(id, request);
    }

    @DeleteMapping("/guests/{id}")
    public ResponseEntity<Void> deleteGuest(@PathVariable Long id) {
        adminGuestService.deleteGuest(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/rsvp/summary")
    public AdminRsvpSummaryResponse getSummary() {
        return adminGuestService.getRsvpSummary();
    }
}
