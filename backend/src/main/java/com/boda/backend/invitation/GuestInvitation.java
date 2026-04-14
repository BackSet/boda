package com.boda.backend.invitation;

import java.time.Instant;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "guest_invitations")
public class GuestInvitation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 120)
    private String token;

    @Column(nullable = false, length = 140)
    private String guestName;

    @Column(length = 160)
    private String guestEmail;

    @Column(nullable = false)
    private Integer maxGuests;

    @Column(nullable = false, length = 160)
    private String eventTitle;

    @Column(nullable = false, length = 120)
    private String eventDate;

    @Column(nullable = false, length = 220)
    private String ceremonyAddress;

    @Column(nullable = false, length = 220)
    private String receptionAddress;

    private Boolean attending;

    private Integer guestCount;

    @Column(length = 500)
    private String dietaryRestrictions;

    @Column(length = 1000)
    private String message;

    private Instant respondedAt;

    public Long getId() {
        return id;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getGuestName() {
        return guestName;
    }

    public void setGuestName(String guestName) {
        this.guestName = guestName;
    }

    public String getGuestEmail() {
        return guestEmail;
    }

    public void setGuestEmail(String guestEmail) {
        this.guestEmail = guestEmail;
    }

    public Integer getMaxGuests() {
        return maxGuests;
    }

    public void setMaxGuests(Integer maxGuests) {
        this.maxGuests = maxGuests;
    }

    public String getEventTitle() {
        return eventTitle;
    }

    public void setEventTitle(String eventTitle) {
        this.eventTitle = eventTitle;
    }

    public String getEventDate() {
        return eventDate;
    }

    public void setEventDate(String eventDate) {
        this.eventDate = eventDate;
    }

    public String getCeremonyAddress() {
        return ceremonyAddress;
    }

    public void setCeremonyAddress(String ceremonyAddress) {
        this.ceremonyAddress = ceremonyAddress;
    }

    public String getReceptionAddress() {
        return receptionAddress;
    }

    public void setReceptionAddress(String receptionAddress) {
        this.receptionAddress = receptionAddress;
    }

    public Boolean getAttending() {
        return attending;
    }

    public void setAttending(Boolean attending) {
        this.attending = attending;
    }

    public Integer getGuestCount() {
        return guestCount;
    }

    public void setGuestCount(Integer guestCount) {
        this.guestCount = guestCount;
    }

    public String getDietaryRestrictions() {
        return dietaryRestrictions;
    }

    public void setDietaryRestrictions(String dietaryRestrictions) {
        this.dietaryRestrictions = dietaryRestrictions;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Instant getRespondedAt() {
        return respondedAt;
    }

    public void setRespondedAt(Instant respondedAt) {
        this.respondedAt = respondedAt;
    }
}
