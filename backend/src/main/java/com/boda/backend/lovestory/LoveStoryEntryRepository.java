package com.boda.backend.lovestory;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface LoveStoryEntryRepository extends JpaRepository<LoveStoryEntry, Long> {

    List<LoveStoryEntry> findByAuthorOrderByEventDateAscSortOrderAsc(LoveStoryAuthor author);

    List<LoveStoryEntry> findByAuthorAndEventDateOrderBySortOrderAsc(
            LoveStoryAuthor author, LocalDate eventDate);

    List<LoveStoryEntry> findAllByOrderByEventDateAscSortOrderAsc();
}
