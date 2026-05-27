package com.boda.backend.content;

import java.util.List;

import com.boda.backend.event.PublicEventResponse;
import com.boda.backend.lovestory.PublicLoveStoryResponse;

public record PublicHomePageResponse(
        PublicEventResponse event,
        List<PublicHomeContentResponse> sections,
        PublicLoveStoryResponse loveStory) {
}
