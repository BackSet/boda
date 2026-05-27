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
public class AdminContentController {

    private final ContentManagementService contentManagementService;

    public AdminContentController(ContentManagementService contentManagementService) {
        this.contentManagementService = contentManagementService;
    }

    @GetMapping("/content-sections")
    public List<AdminHomeContentResponse> listContentSections() {
        return contentManagementService.listHomeSections();
    }

    @PostMapping("/content-sections")
    public AdminHomeContentResponse createContentSection(@Valid @RequestBody AdminHomeContentUpsertRequest request) {
        return contentManagementService.createHomeSection(request);
    }

    @PutMapping("/content-sections/{id}")
    public AdminHomeContentResponse updateContentSection(
            @PathVariable Long id,
            @Valid @RequestBody AdminHomeContentUpsertRequest request) {
        return contentManagementService.updateHomeSection(id, request);
    }

    @DeleteMapping("/content-sections/{id}")
    public ResponseEntity<Void> deleteContentSection(@PathVariable Long id) {
        contentManagementService.deleteHomeSection(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/content-sections/reorder")
    public ResponseEntity<Void> reorderContentSections(@Valid @RequestBody AdminReorderRequest request) {
        contentManagementService.reorderHomeSections(request);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/bank-accounts")
    public List<AdminBankAccountResponse> listBankAccounts() {
        return contentManagementService.listBankAccounts();
    }

    @PostMapping("/bank-accounts")
    public AdminBankAccountResponse createBankAccount(@Valid @RequestBody AdminBankAccountUpsertRequest request) {
        return contentManagementService.createBankAccount(request);
    }

    @PutMapping("/bank-accounts/{id}")
    public AdminBankAccountResponse updateBankAccount(
            @PathVariable Long id,
            @Valid @RequestBody AdminBankAccountUpsertRequest request) {
        return contentManagementService.updateBankAccount(id, request);
    }

    @DeleteMapping("/bank-accounts/{id}")
    public ResponseEntity<Void> deleteBankAccount(@PathVariable Long id) {
        contentManagementService.deleteBankAccount(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/bank-accounts/reorder")
    public ResponseEntity<Void> reorderBankAccounts(@Valid @RequestBody AdminReorderRequest request) {
        contentManagementService.reorderBankAccounts(request);
        return ResponseEntity.noContent().build();
    }
}
