package com.boda.backend.lovestory;

import java.util.List;

import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.boda.backend.partner.PartnerAuthInterceptor;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/partner/love-story")
@Validated
public class PartnerLoveStoryController {

    private final LoveStoryService loveStoryService;

    public PartnerLoveStoryController(LoveStoryService loveStoryService) {
        this.loveStoryService = loveStoryService;
    }

    @GetMapping("/entries")
    public List<PartnerLoveStoryEntryResponse> listEntries(HttpServletRequest request) {
        LoveStoryAuthor author = currentAuthor(request);
        return loveStoryService.listPartnerEntries(author);
    }

    @PostMapping("/entries")
    public PartnerLoveStoryEntryResponse createEntry(
            HttpServletRequest request,
            @Valid @RequestBody PartnerLoveStoryEntryRequest body) {
        return loveStoryService.createPartnerEntry(currentAuthor(request), body);
    }

    @PutMapping("/entries/{id}")
    public PartnerLoveStoryEntryResponse updateEntry(
            HttpServletRequest request,
            @PathVariable Long id,
            @Valid @RequestBody PartnerLoveStoryEntryRequest body) {
        return loveStoryService.updatePartnerEntry(currentAuthor(request), id, body);
    }

    @DeleteMapping("/entries/{id}")
    public void deleteEntry(HttpServletRequest request, @PathVariable Long id) {
        loveStoryService.deletePartnerEntry(currentAuthor(request), id);
    }

    private LoveStoryAuthor currentAuthor(HttpServletRequest request) {
        return (LoveStoryAuthor) request.getAttribute(PartnerAuthInterceptor.PARTNER_AUTHOR_ATTRIBUTE);
    }
}
