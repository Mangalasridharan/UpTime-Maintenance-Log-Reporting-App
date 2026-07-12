package com.msd.uptime.backend.controllers;

import com.msd.uptime.backend.DTO.DashboardResponse;
import com.msd.uptime.backend.DTO.MachineRequest;
import com.msd.uptime.backend.models.Machine;
import com.msd.uptime.backend.models.MachineStatus;
import com.msd.uptime.backend.services.StatusDashboardService;
import com.msd.uptime.backend.services.MachineService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/uptime/api/v1/machines")
public class MachineController {

    @Autowired
    private MachineService machineService;

    @Autowired
    private StatusDashboardService statusDashboardService;

    @PreAuthorize("hasRole ('HEAD')")
    @PostMapping()
    public Machine createMachine(@RequestBody MachineRequest machineRequest){
        return machineService.createMachine(machineRequest);
    }

    @GetMapping("/{id}")
    public Machine getMachine(@PathVariable Long id){
        return machineService.getMachineById(id);
    }

    @GetMapping()
    public List<Machine> getAllMachines(){
        return machineService.getAllMachines();
    }

    @PreAuthorize("hasRole ('HEAD')")
    @DeleteMapping("/{id}")
    public String deleteMachine(@PathVariable Long id){
        machineService.deleteMachineById(id);
        return "Machine Deleted Successfully!";
    }

    @GetMapping("/dashboard")
    public DashboardResponse getAllMachinesDashboard(){
        return statusDashboardService.getStatusDashboard();
    }

    @PatchMapping("/{id}/{status}")
    public Machine updateMachineStatus(@PathVariable Long id, @PathVariable MachineStatus status){
        return machineService.changeMachineStatus(id, status);
    }

}
