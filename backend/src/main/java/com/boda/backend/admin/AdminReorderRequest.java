package com.boda.backend.admin;

import java.util.List;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

public record AdminReorderRequest(
        @NotEmpty List<@NotNull Long> orderedIds) {
}
