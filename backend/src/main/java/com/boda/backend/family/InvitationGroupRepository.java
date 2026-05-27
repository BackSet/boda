package com.boda.backend.family;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface InvitationGroupRepository extends JpaRepository<InvitationGroup, Long> {
    Optional<InvitationGroup> findByToken(String token);

    @Query("select distinct g from InvitationGroup g left join fetch g.members where g.token = :token")
    Optional<InvitationGroup> findByTokenWithMembers(@Param("token") String token);

    @Query("select distinct g from InvitationGroup g left join fetch g.members order by g.id desc")
    List<InvitationGroup> findAllWithMembers();

    @Query("select distinct g from InvitationGroup g left join fetch g.members where g.id = :id")
    Optional<InvitationGroup> findByIdWithMembers(@Param("id") Long id);

    boolean existsByToken(String token);

    long countByRespondedAtIsNotNull();

    long countByRespondedAtIsNull();

    @Query("select count(g) from InvitedGuest g where g.attending = true")
    long countGuestsAttendingTrue();

    @Query("select count(g) from InvitedGuest g where g.attending = false")
    long countGuestsAttendingFalse();
}
