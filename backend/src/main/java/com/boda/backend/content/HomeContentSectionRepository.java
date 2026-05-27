package com.boda.backend.content;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface HomeContentSectionRepository extends JpaRepository<HomeContentSection, Long> {
    List<HomeContentSection> findAllByOrderByOrderIndexAsc();
    List<HomeContentSection> findByEnabledTrueOrderByOrderIndexAsc();
}
