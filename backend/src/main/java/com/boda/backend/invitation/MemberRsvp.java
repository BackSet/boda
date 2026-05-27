package com.boda.backend.invitation;

import jakarta.validation.constraints.NotNull;

public record MemberRsvp(
        @NotNull Long guestId,
        @NotNull Boolean attending) {
}
