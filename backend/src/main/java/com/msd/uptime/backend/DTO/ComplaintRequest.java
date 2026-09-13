package com.msd.uptime.backend.DTO;

public record ComplaintRequest(
        String description,
        Long machineId,
        Long employeeId
) {}