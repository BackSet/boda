package com.boda.backend.invitation;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface GuestInvitationRepository extends JpaRepository<GuestInvitation, Long> {
    Optional<GuestInvitation> findByToken(String token);
    boolean existsByToken(String token);
    long countByAttendingTrue();
    long countByAttendingFalse();
    long countByAttendingIsNull();

    @Query("select coalesce(sum(g.guestCount), 0) from GuestInvitation g where g.attending = true")
    long sumGuestCountForAttending();
}
