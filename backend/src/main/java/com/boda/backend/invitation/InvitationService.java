package com.boda.backend.invitation;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.boda.backend.content.ContentManagementService;
import com.boda.backend.event.WeddingEventService;
import com.boda.backend.family.FamilyGroupService;
import com.boda.backend.family.InvitationGroup;

@Service
public class InvitationService {

    private final FamilyGroupService familyGroupService;
    private final WeddingEventService weddingEventService;
    private final ContentManagementService contentManagementService;

    public InvitationService(
            FamilyGroupService familyGroupService,
            WeddingEventService weddingEventService,
            ContentManagementService contentManagementService) {
        this.familyGroupService = familyGroupService;
        this.weddingEventService = weddingEventService;
        this.contentManagementService = contentManagementService;
    }

    @Transactional(readOnly = true)
    public InvitationBundleResponse getInvitationBundle(String token) {
        InvitationGroup group = familyGroupService.getByTokenWithMembers(token);
        return new InvitationBundleResponse(
                familyGroupService.toPublicGroupResponse(group),
                familyGroupService.toPublicGuestResponses(group),
                weddingEventService.getPublicEvent(),
                contentManagementService.listPublicInvitationSections(),
                contentManagementService.listPublicBankAccounts());
    }

    @Transactional
    public void submitRsvp(RsvpRequest request) {
        familyGroupService.submitRsvp(request);
    }
}
