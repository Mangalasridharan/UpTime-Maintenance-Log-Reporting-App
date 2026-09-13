package com.msd.uptime.backend.DTO;

public record DashboardResponse(
        Long totalMachines,
        Long runningMachines,
        Long idleMachines,
        Long underMaintenanceMachines
) {}