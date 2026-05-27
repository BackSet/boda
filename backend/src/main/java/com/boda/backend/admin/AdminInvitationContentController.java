package com.boda.backend.admin;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.boda.backend.content.ContentManagementService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/admin")
@Validated
public class AdminInvitationContentController {

    private final ContentManagementService contentManagementService;

    public AdminInvitationContentController(ContentManagementService contentManagementService) {
        this.contentManagementService = contentManagementService;
    }

    @GetMapping("/invitation-sections")
    public List<AdminHomeContentResponse> listSections() {
        return contentManagementService.listInvitationSections();
    }

    @PostMapping("/invitation-sections")
    public AdminHomeContentResponse createSection(@Valid @RequestBody AdminHomeContentUpsertRequest request) {
        return contentManagementService.createInvitationSection(request);
    }

    @PutMapping("/invitation-sections/{id}")
    public AdminHomeContentResponse updateSection(
            @PathVariable Long id,
            @Valid @RequestBody AdminHomeContentUpsertRequest request) {
        return contentManagementService.updateInvitationSection(id, request);
    }

    @DeleteMapping("/invitation-sections/{id}")
    public ResponseEntity<Void> deleteSection(@PathVariable Long id) {
        contentManagementService.deleteInvitationSection(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/invitation-sections/reorder")
    public ResponseEntity<Void> reorderSections(@Valid @RequestBody AdminReorderRequest request) {
        contentManagementService.reorderInvitationSections(request);
        return ResponseEntity.noContent().build();
    }
}
