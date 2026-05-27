package com.boda.backend.content;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/content")
public class PublicContentController {

    private final ContentManagementService contentManagementService;

    public PublicContentController(ContentManagementService contentManagementService) {
        this.contentManagementService = contentManagementService;
    }

    @GetMapping("/home")
    public PublicHomePageResponse getHomeContent() {
        return contentManagementService.getPublicHomePage();
    }
}
