package com.msd.uptime.backend.services;

import com.msd.uptime.backend.models.Machine;
import com.msd.uptime.backend.repositories.MachineRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MachineServiceImpl implements MachineService {

    @Autowired
    private MachineRepository machineRepository;

    public Machine createMachine(Machine machine){
        return machineRepository.save(machine);
    }

    public Machine getMachineById(Long id){
        return machineRepository.findById(id).orElse(null);
    }

    public List<Machine> getAllMachines(){
        return machineRepository.findAll();
    }

    public void deleteMachineById(Long id){
        machineRepository.deleteById(id);
    }
}
