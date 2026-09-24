package com.msd.uptime.backend.DTO;

import com.msd.uptime.backend.models.Complaint;
import com.msd.uptime.backend.models.Machine;
import com.msd.uptime.backend.models.MaintenanceLogs;

import java.util.List;

public record MachineWorkHistory(
        Machine machine,
        List<Complaint> complaints,
        List<MaintenanceLogs> maintenanceLogs
) {}