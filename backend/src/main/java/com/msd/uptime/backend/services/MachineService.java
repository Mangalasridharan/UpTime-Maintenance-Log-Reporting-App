package com.msd.uptime.backend.services;
import com.msd.uptime.backend.models.Machine;
import java.util.List;

public interface MachineService {
    Machine createMachine(Machine machine);
    List<Machine> getAllMachines();
    Machine getMachineById(Long id);
    void deleteMachineById(Long id);
}
