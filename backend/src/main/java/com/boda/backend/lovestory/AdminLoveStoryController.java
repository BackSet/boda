package com.boda.backend.lovestory;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/admin/love-story")
@Validated
public class AdminLoveStoryController {

    private final LoveStoryService loveStoryService;

    public AdminLoveStoryController(LoveStoryService loveStoryService) {
        this.loveStoryService = loveStoryService;
    }

    @GetMapping("/settings")
    public AdminLoveStorySettingsResponse getSettings() {
        return loveStoryService.getAdminSettings();
    }

    @PutMapping("/settings")
    public AdminLoveStorySettingsResponse updateSettings(
            @Valid @RequestBody AdminLoveStorySettingsRequest request) {
        return loveStoryService.updateAdminSettings(request);
    }

    @GetMapping("/entries")
    public List<AdminLoveStoryEntryResponse> listEntries() {
        return loveStoryService.listAdminEntries();
    }

    @GetMapping("/preview")
    public PublicLoveStoryResponse preview() {
        return loveStoryService.getAdminPreview();
    }

    @DeleteMapping("/entries/{id}")
    public ResponseEntity<Void> deleteEntry(@PathVariable Long id) {
        loveStoryService.deleteAdminEntry(id);
        return ResponseEntity.noContent().build();
    }
}
