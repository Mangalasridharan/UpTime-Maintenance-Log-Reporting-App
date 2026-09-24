package com.msd.uptime.backend.services;
import com.msd.uptime.backend.DTO.DashboardResponse;
import com.msd.uptime.backend.DTO.MachineRequest;
import com.msd.uptime.backend.DTO.MachineWorkHistory;
import com.msd.uptime.backend.models.Machine;
import com.msd.uptime.backend.models.MachineStatus;

import java.util.List;

public interface MachineService {
    Machine createMachine(MachineRequest machine);
    List<Machine> getAllMachines();
    Machine getMachineById(Long id);
    void deleteMachineById(Long id);
    Machine changeMachineStatus(Long id, MachineStatus machineStatus);
    MachineWorkHistory getMachineWorkHistory(Long id);
}
