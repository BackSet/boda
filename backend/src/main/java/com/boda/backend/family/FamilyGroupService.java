package com.boda.backend.family;

import java.time.Instant;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.boda.backend.admin.AdminFamilyGroupResponse;
import com.boda.backend.admin.AdminFamilyGroupUpsertRequest;
import com.boda.backend.admin.AdminFamilyMemberRequest;
import com.boda.backend.admin.AdminFamilyMemberResponse;
import com.boda.backend.admin.AdminRsvpSummaryResponse;
import com.boda.backend.invitation.MemberRsvp;
import com.boda.backend.invitation.RsvpRequest;

@Service
public class FamilyGroupService {

    private final InvitationGroupRepository groupRepository;
    private final String frontendBaseUrl;

    public FamilyGroupService(
            InvitationGroupRepository groupRepository,
            @Value("${app.frontend.base-url}") String frontendBaseUrl) {
        this.groupRepository = groupRepository;
        this.frontendBaseUrl = frontendBaseUrl;
    }

    @Transactional(readOnly = true)
    public InvitationGroup getByTokenWithMembers(String token) {
        return groupRepository.findByTokenWithMembers(token)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Token de invitacion no valido"));
    }

    @Transactional(readOnly = true)
    public List<AdminFamilyGroupResponse> listAdminGroups() {
        return groupRepository.findAllWithMembers().stream()
                .map(this::toAdminResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public AdminFamilyGroupResponse getAdminGroup(Long id) {
        InvitationGroup group = groupRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Grupo no encontrado"));
        return toAdminResponse(group);
    }

    @Transactional
    public AdminFamilyGroupResponse createGroup(AdminFamilyGroupUpsertRequest request) {
        InvitationGroup group = new InvitationGroup();
        group.setToken(generateUniqueToken());
        applyUpsert(request, group, true);
        return toAdminResponse(groupRepository.save(group));
    }

    @Transactional
    public AdminFamilyGroupResponse updateGroup(Long id, AdminFamilyGroupUpsertRequest request) {
        InvitationGroup group = groupRepository.findByIdWithMembers(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Grupo no encontrado"));
        applyUpsert(request, group, false);
        return toAdminResponse(groupRepository.save(group));
    }

    @Transactional
    public void deleteGroup(Long id) {
        InvitationGroup group = groupRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Grupo no encontrado"));
        groupRepository.delete(group);
    }

    @Transactional
    public void submitRsvp(RsvpRequest request) {
        InvitationGroup group = getByTokenWithMembers(request.token());
        Map<Long, InvitedGuest> byId = new HashMap<>();
        for (InvitedGuest member : group.getMembers()) {
            byId.put(member.getId(), member);
        }

        if (request.members().size() != byId.size()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Debe confirmar asistencia para todos los miembros del grupo");
        }

        Set<Long> seen = new HashSet<>();
        for (MemberRsvp memberRsvp : request.members()) {
            if (!seen.add(memberRsvp.guestId())) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "guestId duplicado en la solicitud");
            }
            InvitedGuest guest = byId.get(memberRsvp.guestId());
            if (guest == null) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "guestId no pertenece al grupo");
            }
            guest.setAttending(memberRsvp.attending());
        }

        group.setDietaryRestrictions(normalizeOptional(request.dietaryRestrictions()));
        group.setMessage(normalizeOptional(request.message()));
        group.setRespondedAt(Instant.now());
        groupRepository.save(group);
    }

    @Transactional(readOnly = true)
    public AdminRsvpSummaryResponse getRsvpSummary() {
        return new AdminRsvpSummaryResponse(
                groupRepository.countGuestsAttendingTrue(),
                groupRepository.countGuestsAttendingFalse(),
                groupRepository.countByRespondedAtIsNotNull(),
                groupRepository.countByRespondedAtIsNull());
    }

    public InvitationGroupResponse toPublicGroupResponse(InvitationGroup group) {
        return new InvitationGroupResponse(
                group.getToken(),
                group.getDisplayName(),
                group.getContactEmail(),
                group.getDietaryRestrictions(),
                group.getMessage(),
                group.getRespondedAt());
    }

    public List<GuestResponse> toPublicGuestResponses(InvitationGroup group) {
        return group.getMembers().stream()
                .map(member -> new GuestResponse(
                        member.getId(),
                        member.getFullName(),
                        member.getSortOrder(),
                        member.getAttending(),
                        member.isPrimaryGuest()))
                .toList();
    }

    private void applyUpsert(AdminFamilyGroupUpsertRequest request, InvitationGroup group, boolean creating) {
        group.setDisplayName(request.displayName().trim());
        group.setContactEmail(normalizeOptional(request.contactEmail()));

        long primaryCount = request.members().stream().filter(AdminFamilyMemberRequest::primaryGuest).count();
        if (primaryCount != 1) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Debe haber exactamente un miembro principal");
        }

        if (!creating && group.getRespondedAt() != null) {
            if (request.members().size() != group.getMembers().size()) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "No se pueden agregar ni quitar miembros despues de confirmar RSVP");
            }
            List<InvitedGuest> existing = group.getMembers();
            for (int index = 0; index < existing.size(); index++) {
                InvitedGuest member = existing.get(index);
                AdminFamilyMemberRequest memberRequest = request.members().get(index);
                member.setFullName(memberRequest.fullName().trim());
                member.setPrimaryGuest(memberRequest.primaryGuest());
            }
            return;
        }

        group.getMembers().clear();
        int order = 1;
        for (AdminFamilyMemberRequest memberRequest : request.members()) {
            InvitedGuest member = new InvitedGuest();
            member.setGroup(group);
            member.setFullName(memberRequest.fullName().trim());
            member.setSortOrder(order++);
            member.setPrimaryGuest(memberRequest.primaryGuest());
            member.setAttending(null);
            group.getMembers().add(member);
        }
    }

    private AdminFamilyGroupResponse toAdminResponse(InvitationGroup group) {
        String baseUrl = frontendBaseUrl.endsWith("/")
                ? frontendBaseUrl.substring(0, frontendBaseUrl.length() - 1)
                : frontendBaseUrl;
        String invitationUrl = baseUrl + "/invitacion/" + group.getToken();

        List<AdminFamilyMemberResponse> members = group.getMembers().stream()
                .map(member -> new AdminFamilyMemberResponse(
                        member.getId(),
                        member.getFullName(),
                        member.getSortOrder(),
                        member.getAttending(),
                        member.isPrimaryGuest()))
                .toList();

        return new AdminFamilyGroupResponse(
                group.getId(),
                group.getToken(),
                invitationUrl,
                group.getDisplayName(),
                group.getContactEmail(),
                group.getDietaryRestrictions(),
                group.getMessage(),
                group.getRespondedAt(),
                members);
    }

    private String generateUniqueToken() {
        String token;
        do {
            token = UUID.randomUUID().toString().replace("-", "").substring(0, 12);
        } while (groupRepository.existsByToken(token));
        return token;
    }

    private String normalizeOptional(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }
        return value.trim();
    }
}
