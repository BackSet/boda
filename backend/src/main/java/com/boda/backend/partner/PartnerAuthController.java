package com.boda.backend.partner;

import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/partner")
@Validated
public class PartnerAuthController {

    private final PartnerSessionService partnerSessionService;

    public PartnerAuthController(PartnerSessionService partnerSessionService) {
        this.partnerSessionService = partnerSessionService;
    }

    @PostMapping("/login")
    public PartnerLoginResponse login(@Valid @RequestBody PartnerLoginRequest request) {
        return partnerSessionService.login(request);
    }
}
