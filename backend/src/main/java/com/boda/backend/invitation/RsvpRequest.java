package com.boda.backend.invitation;

import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;

public record RsvpRequest(
        @NotBlank String token,
        @NotEmpty List<@Valid MemberRsvp> members,
        @Size(max = 500) String dietaryRestrictions,
        @Size(max = 1000) String message) {
}
