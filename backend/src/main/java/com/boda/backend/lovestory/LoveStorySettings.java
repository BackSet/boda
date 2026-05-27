package com.boda.backend.lovestory;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "love_story_settings")
public class LoveStorySettings {

    @Id
    private Long id = 1L;

    @Column(nullable = false)
    private boolean enabled = false;

    @Column(nullable = false)
    private boolean published = false;

    @Column(nullable = false, length = 160)
    private String sectionTitle = "Nuestra historia de amor";

    @Column(length = 280)
    private String sectionSubtitle;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public boolean isEnabled() {
        return enabled;
    }

    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }

    public boolean isPublished() {
        return published;
    }

    public void setPublished(boolean published) {
        this.published = published;
    }

    public String getSectionTitle() {
        return sectionTitle;
    }

    public void setSectionTitle(String sectionTitle) {
        this.sectionTitle = sectionTitle;
    }

    public String getSectionSubtitle() {
        return sectionSubtitle;
    }

    public void setSectionSubtitle(String sectionSubtitle) {
        this.sectionSubtitle = sectionSubtitle;
    }
}
