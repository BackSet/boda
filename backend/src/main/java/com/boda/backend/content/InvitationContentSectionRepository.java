package com.boda.backend.content;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface InvitationContentSectionRepository extends JpaRepository<InvitationContentSection, Long> {
    List<InvitationContentSection> findAllByOrderByOrderIndexAsc();

    List<InvitationContentSection> findByEnabledTrueOrderByOrderIndexAsc();
}
