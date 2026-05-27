package com.boda.backend.family;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "invited_guests")
public class InvitedGuest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "group_id", nullable = false)
    private InvitationGroup group;

    @Column(nullable = false, length = 140)
    private String fullName;

    @Column(nullable = false)
    private Integer sortOrder;

    private Boolean attending;

    @Column(nullable = false)
    private boolean primaryGuest;

    public Long getId() {
        return id;
    }

    public InvitationGroup getGroup() {
        return group;
    }

    public void setGroup(InvitationGroup group) {
        this.group = group;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public Integer getSortOrder() {
        return sortOrder;
    }

    public void setSortOrder(Integer sortOrder) {
        this.sortOrder = sortOrder;
    }

    public Boolean getAttending() {
        return attending;
    }

    public void setAttending(Boolean attending) {
        this.attending = attending;
    }

    public boolean isPrimaryGuest() {
        return primaryGuest;
    }

    public void setPrimaryGuest(boolean primaryGuest) {
        this.primaryGuest = primaryGuest;
    }
}
