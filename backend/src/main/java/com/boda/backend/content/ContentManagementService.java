package com.boda.backend.content;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.boda.backend.admin.AdminBankAccountResponse;
import com.boda.backend.admin.AdminBankAccountUpsertRequest;
import com.boda.backend.admin.AdminHomeContentResponse;
import com.boda.backend.admin.AdminHomeContentUpsertRequest;
import com.boda.backend.admin.AdminReorderRequest;
import com.boda.backend.event.PublicEventResponse;
import com.boda.backend.event.WeddingEventService;
import com.boda.backend.lovestory.LoveStoryService;
import com.boda.backend.lovestory.PublicLoveStoryResponse;

@Service
public class ContentManagementService {

    private final HomeContentSectionRepository homeRepository;
    private final InvitationContentSectionRepository invitationRepository;
    private final BankAccountInfoRepository bankRepository;
    private final WeddingEventService weddingEventService;
    private final LoveStoryService loveStoryService;

    public ContentManagementService(
            HomeContentSectionRepository homeRepository,
            InvitationContentSectionRepository invitationRepository,
            BankAccountInfoRepository bankRepository,
            WeddingEventService weddingEventService,
            LoveStoryService loveStoryService) {
        this.homeRepository = homeRepository;
        this.invitationRepository = invitationRepository;
        this.bankRepository = bankRepository;
        this.weddingEventService = weddingEventService;
        this.loveStoryService = loveStoryService;
    }

    @Transactional(readOnly = true)
    public List<AdminHomeContentResponse> listHomeSections() {
        return homeRepository.findAllByOrderByOrderIndexAsc().stream()
                .map(this::toAdminHomeResponse)
                .toList();
    }

    @Transactional
    public AdminHomeContentResponse createHomeSection(AdminHomeContentUpsertRequest request) {
        HomeContentSection section = new HomeContentSection();
        applyHomeUpsert(request, section);
        return toAdminHomeResponse(homeRepository.save(section));
    }

    @Transactional
    public AdminHomeContentResponse updateHomeSection(Long id, AdminHomeContentUpsertRequest request) {
        HomeContentSection section = homeRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Seccion no encontrada"));
        applyHomeUpsert(request, section);
        return toAdminHomeResponse(homeRepository.save(section));
    }

    @Transactional
    public void deleteHomeSection(Long id) {
        HomeContentSection section = homeRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Seccion no encontrada"));
        homeRepository.delete(section);
    }

    @Transactional
    public void reorderHomeSections(AdminReorderRequest request) {
        List<HomeContentSection> sections = homeRepository.findAll();
        if (sections.size() != request.orderedIds().size()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "La cantidad de ids para reordenar es invalida");
        }
        Map<Long, HomeContentSection> byId = new HashMap<>();
        for (HomeContentSection section : sections) {
            byId.put(section.getId(), section);
        }
        for (int index = 0; index < request.orderedIds().size(); index++) {
            Long id = request.orderedIds().get(index);
            HomeContentSection section = byId.get(id);
            if (section == null) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Id de seccion no valido para reordenar");
            }
            section.setOrderIndex(index + 1);
        }
        homeRepository.saveAll(sections);
    }

    @Transactional(readOnly = true)
    public List<AdminBankAccountResponse> listBankAccounts() {
        return bankRepository.findAllByOrderByOrderIndexAsc().stream()
                .map(this::toAdminBankResponse)
                .toList();
    }

    @Transactional
    public AdminBankAccountResponse createBankAccount(AdminBankAccountUpsertRequest request) {
        BankAccountInfo account = new BankAccountInfo();
        applyBankUpsert(request, account);
        return toAdminBankResponse(bankRepository.save(account));
    }

    @Transactional
    public AdminBankAccountResponse updateBankAccount(Long id, AdminBankAccountUpsertRequest request) {
        BankAccountInfo account = bankRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Cuenta bancaria no encontrada"));
        applyBankUpsert(request, account);
        return toAdminBankResponse(bankRepository.save(account));
    }

    @Transactional
    public void deleteBankAccount(Long id) {
        BankAccountInfo account = bankRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Cuenta bancaria no encontrada"));
        bankRepository.delete(account);
    }

    @Transactional
    public void reorderBankAccounts(AdminReorderRequest request) {
        List<BankAccountInfo> accounts = bankRepository.findAll();
        if (accounts.size() != request.orderedIds().size()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "La cantidad de ids para reordenar es invalida");
        }
        Map<Long, BankAccountInfo> byId = new HashMap<>();
        for (BankAccountInfo account : accounts) {
            byId.put(account.getId(), account);
        }
        for (int index = 0; index < request.orderedIds().size(); index++) {
            Long id = request.orderedIds().get(index);
            BankAccountInfo account = byId.get(id);
            if (account == null) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Id de cuenta no valido para reordenar");
            }
            account.setOrderIndex(index + 1);
        }
        bankRepository.saveAll(accounts);
    }

    @Transactional(readOnly = true)
    public PublicHomePageResponse getPublicHomePage() {
        PublicEventResponse event = weddingEventService.getPublicEvent();
        List<PublicHomeContentResponse> sections = homeRepository.findByEnabledTrueOrderByOrderIndexAsc().stream()
                .map(this::toPublicHomeResponse)
                .toList();
        PublicLoveStoryResponse loveStory = loveStoryService.getPublicLoveStory();
        return new PublicHomePageResponse(event, sections, loveStory);
    }

    @Transactional(readOnly = true)
    public List<AdminHomeContentResponse> listInvitationSections() {
        return invitationRepository.findAllByOrderByOrderIndexAsc().stream()
                .map(this::toAdminInvitationResponse)
                .toList();
    }

    @Transactional
    public AdminHomeContentResponse createInvitationSection(AdminHomeContentUpsertRequest request) {
        InvitationContentSection section = new InvitationContentSection();
        applyInvitationUpsert(request, section);
        return toAdminInvitationResponse(invitationRepository.save(section));
    }

    @Transactional
    public AdminHomeContentResponse updateInvitationSection(Long id, AdminHomeContentUpsertRequest request) {
        InvitationContentSection section = invitationRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Seccion no encontrada"));
        applyInvitationUpsert(request, section);
        return toAdminInvitationResponse(invitationRepository.save(section));
    }

    @Transactional
    public void deleteInvitationSection(Long id) {
        InvitationContentSection section = invitationRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Seccion no encontrada"));
        invitationRepository.delete(section);
    }

    @Transactional
    public void reorderInvitationSections(AdminReorderRequest request) {
        List<InvitationContentSection> sections = invitationRepository.findAll();
        if (sections.size() != request.orderedIds().size()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "La cantidad de ids para reordenar es invalida");
        }
        Map<Long, InvitationContentSection> byId = new HashMap<>();
        for (InvitationContentSection section : sections) {
            byId.put(section.getId(), section);
        }
        for (int index = 0; index < request.orderedIds().size(); index++) {
            Long id = request.orderedIds().get(index);
            InvitationContentSection section = byId.get(id);
            if (section == null) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Id de seccion no valido para reordenar");
            }
            section.setOrderIndex(index + 1);
        }
        invitationRepository.saveAll(sections);
    }

    @Transactional(readOnly = true)
    public List<PublicInvitationContentResponse> listPublicInvitationSections() {
        return invitationRepository.findByEnabledTrueOrderByOrderIndexAsc().stream()
                .map(this::toPublicInvitationResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<PublicBankAccountResponse> listPublicBankAccounts() {
        return bankRepository.findByEnabledTrueOrderByOrderIndexAsc().stream()
                .map(this::toPublicBankResponse)
                .toList();
    }

    private void applyInvitationUpsert(AdminHomeContentUpsertRequest request, InvitationContentSection section) {
        section.setSectionType(request.sectionType().trim());
        section.setTitle(request.title().trim());
        section.setSubtitle(normalizeOptional(request.subtitle()));
        section.setBody(normalizeOptional(request.body()));
        section.setPayloadJson(normalizeOptional(request.payloadJson()));
        section.setOrderIndex(request.orderIndex());
        section.setEnabled(request.enabled());
    }

    private void applyHomeUpsert(AdminHomeContentUpsertRequest request, HomeContentSection section) {
        section.setSectionType(request.sectionType().trim());
        section.setTitle(request.title().trim());
        section.setSubtitle(normalizeOptional(request.subtitle()));
        section.setBody(normalizeOptional(request.body()));
        section.setPayloadJson(normalizeOptional(request.payloadJson()));
        section.setOrderIndex(request.orderIndex());
        section.setEnabled(request.enabled());
    }

    private void applyBankUpsert(AdminBankAccountUpsertRequest request, BankAccountInfo account) {
        account.setBankName(request.bankName().trim());
        account.setAccountHolder(request.accountHolder().trim());
        account.setAccountType(request.accountType().trim());
        account.setAccountNumber(request.accountNumber().trim());
        account.setClabeIban(normalizeOptional(request.clabeIban()));
        account.setAccountAlias(normalizeOptional(request.accountAlias()));
        account.setNotes(normalizeOptional(request.notes()));
        account.setOrderIndex(request.orderIndex());
        account.setEnabled(request.enabled());
    }

    private String normalizeOptional(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }
        return value.trim();
    }

    private AdminHomeContentResponse toAdminHomeResponse(HomeContentSection section) {
        return new AdminHomeContentResponse(
                section.getId(),
                section.getSectionType(),
                section.getTitle(),
                section.getSubtitle(),
                section.getBody(),
                section.getPayloadJson(),
                section.getOrderIndex(),
                section.isEnabled());
    }

    private AdminBankAccountResponse toAdminBankResponse(BankAccountInfo account) {
        return new AdminBankAccountResponse(
                account.getId(),
                account.getBankName(),
                account.getAccountHolder(),
                account.getAccountType(),
                account.getAccountNumber(),
                account.getClabeIban(),
                account.getAccountAlias(),
                account.getNotes(),
                account.getOrderIndex(),
                account.isEnabled());
    }

    private AdminHomeContentResponse toAdminInvitationResponse(InvitationContentSection section) {
        return new AdminHomeContentResponse(
                section.getId(),
                section.getSectionType(),
                section.getTitle(),
                section.getSubtitle(),
                section.getBody(),
                section.getPayloadJson(),
                section.getOrderIndex(),
                section.isEnabled());
    }

    private PublicHomeContentResponse toPublicHomeResponse(HomeContentSection section) {
        return new PublicHomeContentResponse(
                section.getId(),
                section.getSectionType(),
                section.getTitle(),
                section.getSubtitle(),
                section.getBody(),
                section.getPayloadJson(),
                section.getOrderIndex());
    }

    private PublicInvitationContentResponse toPublicInvitationResponse(InvitationContentSection section) {
        return new PublicInvitationContentResponse(
                section.getId(),
                section.getSectionType(),
                section.getTitle(),
                section.getSubtitle(),
                section.getBody(),
                section.getPayloadJson(),
                section.getOrderIndex());
    }

    private PublicBankAccountResponse toPublicBankResponse(BankAccountInfo account) {
        return new PublicBankAccountResponse(
                account.getId(),
                account.getBankName(),
                account.getAccountHolder(),
                account.getAccountType(),
                account.getAccountNumber(),
                account.getClabeIban(),
                account.getAccountAlias(),
                account.getNotes(),
                account.getOrderIndex());
    }

}
