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

import com.boda.backend.family.FamilyGroupService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/admin")
@Validated
public class AdminFamilyGroupController {

    private final FamilyGroupService familyGroupService;

    public AdminFamilyGroupController(FamilyGroupService familyGroupService) {
        this.familyGroupService = familyGroupService;
    }

    @GetMapping("/family-groups")
    public List<AdminFamilyGroupResponse> listGroups() {
        return familyGroupService.listAdminGroups();
    }

    @GetMapping("/family-groups/{id}")
    public AdminFamilyGroupResponse getGroup(@PathVariable Long id) {
        return familyGroupService.getAdminGroup(id);
    }

    @PostMapping("/family-groups")
    public AdminFamilyGroupResponse createGroup(@Valid @RequestBody AdminFamilyGroupUpsertRequest request) {
        return familyGroupService.createGroup(request);
    }

    @PutMapping("/family-groups/{id}")
    public AdminFamilyGroupResponse updateGroup(
            @PathVariable Long id,
            @Valid @RequestBody AdminFamilyGroupUpsertRequest request) {
        return familyGroupService.updateGroup(id, request);
    }

    @DeleteMapping("/family-groups/{id}")
    public ResponseEntity<Void> deleteGroup(@PathVariable Long id) {
        familyGroupService.deleteGroup(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/rsvp/summary")
    public AdminRsvpSummaryResponse getSummary() {
        return familyGroupService.getRsvpSummary();
    }
}
