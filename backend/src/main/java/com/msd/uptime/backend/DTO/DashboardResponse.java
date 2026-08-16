package com.msd.uptime.backend.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class DashboardResponse {
    private Long totalMachines;
    private Long runningMachines;
    private Long idleMachines;
    private Long underMaintenanceMachines;
}
 