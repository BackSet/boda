package com.boda.backend.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;

import com.boda.backend.content.BankAccountInfo;
import com.boda.backend.content.BankAccountInfoRepository;
import com.boda.backend.content.HomeContentSection;
import com.boda.backend.content.HomeContentSectionRepository;
import com.boda.backend.content.InvitationContentSection;
import com.boda.backend.content.InvitationContentSectionRepository;
import com.boda.backend.event.WeddingEvent;
import com.boda.backend.event.WeddingEventRepository;
import com.boda.backend.family.InvitationGroup;
import com.boda.backend.family.InvitationGroupRepository;
import com.boda.backend.family.InvitedGuest;

@Configuration
public class SeedDataConfig {

    @Bean
    @Order(2)
    CommandLineRunner seedWeddingEvent(WeddingEventRepository repository) {
        return args -> {
            if (repository.count() > 0) {
                return;
            }
            WeddingEvent event = new WeddingEvent();
            event.setId(1L);
            event.setCoupleDisplayName("Ana y Daniel");
            event.setEventTitle("Boda de Ana y Daniel");
            event.setEventDate("12 de diciembre de 2026 · 16:00 hrs");
            event.setTargetDateIso("2026-12-12T16:00:00");
            event.setCeremonyAddress("Parroquia de San Miguel, Centro Historico");
            event.setReceptionAddress("Casa Editorial Roma Norte");
            event.setDressCode("Formal elegante · tonos pastel y neutros");
            repository.save(event);
        };
    }

    @Bean
    @Order(2)
    CommandLineRunner seedDemoFamilyGroup(
            InvitationGroupRepository groupRepository,
            @Value("${app.seed.demo-enabled:true}") boolean demoEnabled) {
        return args -> {
            if (!demoEnabled || groupRepository.existsByToken("demo-token")) {
                return;
            }

            InvitationGroup group = new InvitationGroup();
            group.setToken("demo-token");
            group.setDisplayName("Familia Demo");
            group.setContactEmail("demo@boda.local");

            InvitedGuest carlos = new InvitedGuest();
            carlos.setGroup(group);
            carlos.setFullName("Carlos Demo");
            carlos.setSortOrder(1);
            carlos.setPrimaryGuest(true);

            InvitedGuest ana = new InvitedGuest();
            ana.setGroup(group);
            ana.setFullName("Ana Demo");
            ana.setSortOrder(2);
            ana.setPrimaryGuest(false);

            group.getMembers().add(carlos);
            group.getMembers().add(ana);
            groupRepository.save(group);
        };
    }

    @Bean
    @Order(2)
    CommandLineRunner seedHomeContent(HomeContentSectionRepository repository) {
        return args -> {
            if (repository.count() > 0) {
                return;
            }

            HomeContentSection hero = new HomeContentSection();
            hero.setSectionType("hero");
            hero.setTitle("Ana + Daniel");
            hero.setSubtitle("Con mucha ilusion, te invitamos a compartir una celebracion intima.");
            hero.setBody("12 de diciembre de 2026 · Ciudad de Mexico");
            hero.setOrderIndex(1);
            hero.setEnabled(true);

            HomeContentSection countdown = new HomeContentSection();
            countdown.setSectionType("countdown");
            countdown.setTitle("Cuenta regresiva");
            countdown.setSubtitle("Faltan pocos dias para celebrar este nuevo capitulo.");
            countdown.setPayloadJson("{\"targetDateIso\":\"2026-12-12T16:00:00\"}");
            countdown.setOrderIndex(2);
            countdown.setEnabled(true);

            HomeContentSection gallery = new HomeContentSection();
            gallery.setSectionType("gallery");
            gallery.setTitle("Nuestros momentos");
            gallery.setSubtitle("Recuerdos que nos inspiran para este dia.");
            gallery.setPayloadJson(
                    "{\"items\":["
                            + "{\"title\":\"Primer encuentro\",\"imageUrl\":\"https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80\",\"alt\":\"Pareja en un jardin\"},"
                            + "{\"title\":\"Compromiso\",\"imageUrl\":\"https://images.unsplash.com/photo-1522673607217-8b93bbc960f5?w=800&q=80\",\"alt\":\"Anillos de compromiso\"},"
                            + "{\"title\":\"Juntos\",\"imageUrl\":\"https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800&q=80\",\"alt\":\"Celebracion romantica\"}"
                            + "]}");
            gallery.setOrderIndex(3);
            gallery.setEnabled(true);

            repository.save(hero);
            repository.save(countdown);
            repository.save(gallery);
        };
    }

    @Bean
    @Order(2)
    CommandLineRunner seedInvitationContent(InvitationContentSectionRepository repository) {
        return args -> {
            if (repository.count() > 0) {
                return;
            }

            InvitationContentSection welcome = new InvitationContentSection();
            welcome.setSectionType("welcome");
            welcome.setTitle("Bienvenidos");
            welcome.setSubtitle("Gracias por ser parte de nuestra historia");
            welcome.setBody("Esta invitacion fue preparada especialmente para tu familia.");
            welcome.setOrderIndex(1);
            welcome.setEnabled(true);

            InvitationContentSection timeline = new InvitationContentSection();
            timeline.setSectionType("timeline");
            timeline.setTitle("Itinerario del dia");
            timeline.setPayloadJson(
                    "{\"items\":[{\"time\":\"16:00\",\"description\":\"Ceremonia religiosa\"},"
                            + "{\"time\":\"19:00\",\"description\":\"Recepcion y cena\"},"
                            + "{\"time\":\"22:00\",\"description\":\"Baile y brindis\"}]}");
            timeline.setOrderIndex(2);
            timeline.setEnabled(true);

            repository.save(welcome);
            repository.save(timeline);
        };
    }

    @Bean
    @Order(2)
    CommandLineRunner seedBankAccounts(BankAccountInfoRepository repository) {
        return args -> {
            if (repository.count() > 0) {
                return;
            }

            BankAccountInfo accountOne = new BankAccountInfo();
            accountOne.setBankName("Banco Nacional");
            accountOne.setAccountHolder("Ana Lopez");
            accountOne.setAccountType("Ahorros");
            accountOne.setAccountNumber("1234567890");
            accountOne.setClabeIban("012345678901234567");
            accountOne.setAccountAlias("Boda Ana Daniel");
            accountOne.setNotes("Si realizas aporte, agradecemos enviar comprobante por WhatsApp.");
            accountOne.setOrderIndex(1);
            accountOne.setEnabled(true);

            BankAccountInfo accountTwo = new BankAccountInfo();
            accountTwo.setBankName("Banco del Centro");
            accountTwo.setAccountHolder("Daniel Perez");
            accountTwo.setAccountType("Corriente");
            accountTwo.setAccountNumber("9876543210");
            accountTwo.setClabeIban("765432109876543210");
            accountTwo.setAccountAlias("Viaje de bodas");
            accountTwo.setNotes("Opcional: agrega el concepto 'BODA'.");
            accountTwo.setOrderIndex(2);
            accountTwo.setEnabled(true);

            repository.save(accountOne);
            repository.save(accountTwo);
        };
    }
}
