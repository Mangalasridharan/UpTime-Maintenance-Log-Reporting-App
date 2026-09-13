package com.msd.uptime.backend.DTO;

public record MachineRequest(
        String name,
        Long departmentId
) {}