package com.boda.backend.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.boda.backend.invitation.GuestInvitation;
import com.boda.backend.invitation.GuestInvitationRepository;

@Configuration
public class SeedDataConfig {

    @Bean
    CommandLineRunner seedDemoInvitation(
            GuestInvitationRepository repository,
            @Value("${app.seed.demo-enabled:true}") boolean demoEnabled) {
        return args -> {
            if (!demoEnabled || repository.findByToken("demo-token").isPresent()) {
                return;
            }

            GuestInvitation invitation = new GuestInvitation();
            invitation.setToken("demo-token");
            invitation.setGuestName("Invitado Demo");
            invitation.setGuestEmail("demo@boda.local");
            invitation.setMaxGuests(2);
            invitation.setEventTitle("Boda de Ana y Daniel");
            invitation.setEventDate("12 de diciembre de 2026 · 16:00 hrs");
            invitation.setCeremonyAddress("Parroquia de San Miguel, Centro Historico");
            invitation.setReceptionAddress("Casa Editorial Roma Norte");
            repository.save(invitation);
        };
    }
}
