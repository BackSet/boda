package com.boda.backend.invitation;

import java.util.List;

import com.boda.backend.content.PublicBankAccountResponse;
import com.boda.backend.content.PublicInvitationContentResponse;
import com.boda.backend.event.PublicEventResponse;
import com.boda.backend.family.GuestResponse;
import com.boda.backend.family.InvitationGroupResponse;

public record InvitationBundleResponse(
        InvitationGroupResponse group,
        List<GuestResponse> guests,
        PublicEventResponse event,
        List<PublicInvitationContentResponse> sections,
        List<PublicBankAccountResponse> bankAccounts) {
}
