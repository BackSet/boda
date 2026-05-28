package com.boda.backend.content;

import java.util.List;

import com.boda.backend.event.PublicEventTeaserResponse;
import com.boda.backend.lovestory.PublicLoveStoryResponse;

public record PublicHomePageResponse(
        PublicEventTeaserResponse event,
        List<PublicHomeContentResponse> sections,
        PublicLoveStoryResponse loveStory) {
}
