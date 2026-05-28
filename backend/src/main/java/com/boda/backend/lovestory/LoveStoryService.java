package com.boda.backend.lovestory;

import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.boda.backend.partner.PartnerSessionService;

@Service
public class LoveStoryService {

    private static final long SETTINGS_ID = 1L;

    private final LoveStorySettingsRepository settingsRepository;
    private final LoveStoryEntryRepository entryRepository;
    private final PartnerSessionService partnerSessionService;

    public LoveStoryService(
            LoveStorySettingsRepository settingsRepository,
            LoveStoryEntryRepository entryRepository,
            PartnerSessionService partnerSessionService) {
        this.settingsRepository = settingsRepository;
        this.entryRepository = entryRepository;
        this.partnerSessionService = partnerSessionService;
    }

    @Transactional(readOnly = true)
    public PublicLoveStoryResponse getPublicLoveStory() {
        LoveStorySettings settings = getSettings();
        if (!settings.isEnabled() || !settings.isPublished()) {
            return null;
        }

        List<PublicLoveStoryEntryResponse> entries = entryRepository.findAllByOrderByEventDateAscSortOrderAsc().stream()
                .map(entry -> toPublicEntryResponse(entry))
                .toList();

        return new PublicLoveStoryResponse(
                settings.getSectionTitle(),
                settings.getSectionSubtitle(),
                entries);
    }

    @Transactional(readOnly = true)
    public List<PartnerLoveStoryEntryResponse> listPartnerEntries(LoveStoryAuthor author) {
        return entryRepository.findByAuthorOrderByEventDateAscSortOrderAsc(author).stream()
                .map(this::toPartnerEntryResponse)
                .toList();
    }

    @Transactional
    public PartnerLoveStoryEntryResponse createPartnerEntry(
            LoveStoryAuthor author,
            PartnerLoveStoryEntryRequest request) {
        LoveStoryEntry entry = new LoveStoryEntry();
        entry.setAuthor(author);
        applyPartnerUpsert(request, entry);
        entry.setSortOrder(nextSortOrder(author, entry.getEventDate()));
        return toPartnerEntryResponse(entryRepository.save(entry));
    }

    @Transactional
    public PartnerLoveStoryEntryResponse updatePartnerEntry(
            LoveStoryAuthor author,
            Long id,
            PartnerLoveStoryEntryRequest request) {
        LoveStoryEntry entry = getEntryForAuthor(id, author);
        LocalDate previousDate = entry.getEventDate();
        applyPartnerUpsert(request, entry);
        if (!previousDate.equals(entry.getEventDate())) {
            entry.setSortOrder(nextSortOrder(author, entry.getEventDate(), entry.getId()));
        }
        return toPartnerEntryResponse(entryRepository.save(entry));
    }

    @Transactional
    public void deletePartnerEntry(LoveStoryAuthor author, Long id) {
        LoveStoryEntry entry = getEntryForAuthor(id, author);
        entryRepository.delete(entry);
    }

    @Transactional(readOnly = true)
    public AdminLoveStorySettingsResponse getAdminSettings() {
        LoveStorySettings settings = getSettings();
        long countA = entryRepository.findByAuthorOrderByEventDateAscSortOrderAsc(LoveStoryAuthor.PARTNER_A).size();
        long countB = entryRepository.findByAuthorOrderByEventDateAscSortOrderAsc(LoveStoryAuthor.PARTNER_B).size();

        return new AdminLoveStorySettingsResponse(
                settings.isEnabled(),
                settings.isPublished(),
                settings.getSectionTitle(),
                settings.getSectionSubtitle(),
                partnerSessionService.displayNameFor(LoveStoryAuthor.PARTNER_A),
                partnerSessionService.displayNameFor(LoveStoryAuthor.PARTNER_B),
                countA,
                countB);
    }

    @Transactional
    public AdminLoveStorySettingsResponse updateAdminSettings(AdminLoveStorySettingsRequest request) {
        LoveStorySettings settings = getSettings();
        settings.setEnabled(request.enabled());
        settings.setPublished(request.published());
        settings.setSectionTitle(request.sectionTitle().trim());
        settings.setSectionSubtitle(normalizeOptional(request.sectionSubtitle()));
        settingsRepository.save(settings);
        return getAdminSettings();
    }

    @Transactional(readOnly = true)
    public List<AdminLoveStoryEntryResponse> listAdminEntries() {
        return entryRepository.findAllByOrderByEventDateAscSortOrderAsc().stream()
                .map(this::toAdminEntryResponse)
                .toList();
    }

    @Transactional
    public AdminLoveStoryEntryResponse createAdminEntry(AdminLoveStoryEntryRequest request) {
        LoveStoryEntry entry = new LoveStoryEntry();
        applyAdminUpsert(request, entry);
        entry.setSortOrder(nextSortOrder(request.author(), entry.getEventDate()));
        return toAdminEntryResponse(entryRepository.save(entry));
    }

    @Transactional
    public AdminLoveStoryEntryResponse updateAdminEntry(Long id, AdminLoveStoryEntryRequest request) {
        LoveStoryEntry entry = entryRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Momento no encontrado"));
        LoveStoryAuthor previousAuthor = entry.getAuthor();
        LocalDate previousDate = entry.getEventDate();
        applyAdminUpsert(request, entry);
        if (previousAuthor != request.author() || !previousDate.equals(entry.getEventDate())) {
            entry.setSortOrder(nextSortOrder(request.author(), entry.getEventDate(), entry.getId()));
        }
        return toAdminEntryResponse(entryRepository.save(entry));
    }

    @Transactional
    public void deleteAdminEntry(Long id) {
        LoveStoryEntry entry = entryRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Momento no encontrado"));
        entryRepository.delete(entry);
    }

    @Transactional(readOnly = true)
    public PublicLoveStoryResponse getAdminPreview() {
        LoveStorySettings settings = getSettings();
        List<PublicLoveStoryEntryResponse> entries = entryRepository.findAllByOrderByEventDateAscSortOrderAsc().stream()
                .map(this::toPublicEntryResponse)
                .toList();
        return new PublicLoveStoryResponse(
                settings.getSectionTitle(),
                settings.getSectionSubtitle(),
                entries);
    }

    private LoveStorySettings getSettings() {
        return settingsRepository.findById(SETTINGS_ID)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.INTERNAL_SERVER_ERROR, "Configuracion de historia de amor no encontrada"));
    }

    private LoveStoryEntry getEntryForAuthor(Long id, LoveStoryAuthor author) {
        LoveStoryEntry entry = entryRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Momento no encontrado"));
        if (entry.getAuthor() != author) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Momento no encontrado");
        }
        return entry;
    }

    private void applyPartnerUpsert(PartnerLoveStoryEntryRequest request, LoveStoryEntry entry) {
        entry.setEventDate(parseEventDate(request.eventDate()));
        entry.setTitle(normalizeOptional(request.title()));
        entry.setQuote(request.quote().trim());
        entry.setImageUrl(request.imageUrl().trim());
    }

    private void applyAdminUpsert(AdminLoveStoryEntryRequest request, LoveStoryEntry entry) {
        entry.setAuthor(request.author());
        entry.setEventDate(parseEventDate(request.eventDate()));
        entry.setTitle(normalizeOptional(request.title()));
        entry.setQuote(request.quote().trim());
        entry.setImageUrl(request.imageUrl().trim());
    }

    private int nextSortOrder(LoveStoryAuthor author, LocalDate eventDate) {
        return nextSortOrder(author, eventDate, null);
    }

    private int nextSortOrder(LoveStoryAuthor author, LocalDate eventDate, Long excludeId) {
        return entryRepository.findByAuthorAndEventDateOrderBySortOrderAsc(author, eventDate).stream()
                .filter(entry -> excludeId == null || !excludeId.equals(entry.getId()))
                .mapToInt(LoveStoryEntry::getSortOrder)
                .max()
                .orElse(-1) + 1;
    }

    private LocalDate parseEventDate(String value) {
        try {
            return LocalDate.parse(value.trim());
        } catch (DateTimeParseException exception) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Fecha invalida, use formato YYYY-MM-DD");
        }
    }

    private String normalizeOptional(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }
        return value.trim();
    }

    private PartnerLoveStoryEntryResponse toPartnerEntryResponse(LoveStoryEntry entry) {
        return new PartnerLoveStoryEntryResponse(
                entry.getId(),
                entry.getEventDate().toString(),
                entry.getTitle(),
                entry.getQuote(),
                entry.getImageUrl(),
                entry.getSortOrder());
    }

    private PublicLoveStoryEntryResponse toPublicEntryResponse(LoveStoryEntry entry) {
        return new PublicLoveStoryEntryResponse(
                entry.getId(),
                entry.getAuthor().name(),
                partnerSessionService.displayNameFor(entry.getAuthor()),
                entry.getEventDate().toString(),
                entry.getTitle(),
                entry.getQuote(),
                entry.getImageUrl(),
                entry.getSortOrder());
    }

    private AdminLoveStoryEntryResponse toAdminEntryResponse(LoveStoryEntry entry) {
        return new AdminLoveStoryEntryResponse(
                entry.getId(),
                entry.getAuthor(),
                partnerSessionService.displayNameFor(entry.getAuthor()),
                entry.getEventDate().toString(),
                entry.getTitle(),
                entry.getQuote(),
                entry.getImageUrl(),
                entry.getSortOrder());
    }
}
