package com.boda.backend.event;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "wedding_events")
public class WeddingEvent {

    @Id
    private Long id = 1L;

    @Column(nullable = false, length = 120)
    private String coupleDisplayName;

    @Column(nullable = false, length = 160)
    private String eventTitle;

    @Column(nullable = false, length = 120)
    private String eventDate;

    @Column(nullable = false, length = 40)
    private String targetDateIso;

    @Column(nullable = false, length = 220)
    private String ceremonyAddress;

    @Column(nullable = false, length = 220)
    private String receptionAddress;

    @Column(length = 500)
    private String ceremonyMapUrl;

    @Column(length = 500)
    private String receptionMapUrl;

    @Column(length = 280)
    private String dressCode;

    @Column(length = 120)
    private String cityLabel;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCoupleDisplayName() {
        return coupleDisplayName;
    }

    public void setCoupleDisplayName(String coupleDisplayName) {
        this.coupleDisplayName = coupleDisplayName;
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

    public String getTargetDateIso() {
        return targetDateIso;
    }

    public void setTargetDateIso(String targetDateIso) {
        this.targetDateIso = targetDateIso;
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

    public String getCeremonyMapUrl() {
        return ceremonyMapUrl;
    }

    public void setCeremonyMapUrl(String ceremonyMapUrl) {
        this.ceremonyMapUrl = ceremonyMapUrl;
    }

    public String getReceptionMapUrl() {
        return receptionMapUrl;
    }

    public void setReceptionMapUrl(String receptionMapUrl) {
        this.receptionMapUrl = receptionMapUrl;
    }

    public String getDressCode() {
        return dressCode;
    }

    public void setDressCode(String dressCode) {
        this.dressCode = dressCode;
    }

    public String getCityLabel() {
        return cityLabel;
    }

    public void setCityLabel(String cityLabel) {
        this.cityLabel = cityLabel;
    }
}
