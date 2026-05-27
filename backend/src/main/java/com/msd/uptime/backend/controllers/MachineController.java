package com.msd.uptime.backend.controllers;


import com.msd.uptime.backend.models.Machine;
import com.msd.uptime.backend.services.MachineService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/uptime/api/v1/machines")
public class MachineController {

    @Autowired
    private MachineService machineService;

    @PostMapping()
    public Machine createMachine(@RequestBody Machine machine){
        return machineService.createMachine(machine);
    }

    @GetMapping("/{id}")
    public Machine getMachine(@PathVariable Long id){
        return machineService.getMachineById(id);
    }

    @GetMapping()
    public List<Machine> getAllMachines(){
        return machineService.getAllMachines();
    }

    @DeleteMapping("/{id}")
    public String deleteMachine(@RequestBody Long id){
        machineService.deleteMachineById(id);
        return "Machine Deleted Successfully!";
    }
}
