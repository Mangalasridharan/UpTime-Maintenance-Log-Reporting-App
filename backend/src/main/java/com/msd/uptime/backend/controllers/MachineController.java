package com.msd.uptime.backend.controllers;

import com.msd.uptime.backend.DTO.DashboardResponse;
import com.msd.uptime.backend.DTO.MachineRequest;
import com.msd.uptime.backend.models.Machine;
import com.msd.uptime.backend.models.MachineStatus;
import com.msd.uptime.backend.response.ApiResponse;
import com.msd.uptime.backend.services.StatusDashboardService;
import com.msd.uptime.backend.services.MachineService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
    public ResponseEntity<ApiResponse<Machine>> createMachine(@RequestBody MachineRequest machineRequest){
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Machine created successfully", machineService.createMachine(machineRequest)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Machine>> getMachine(@PathVariable Long id){
        return ResponseEntity.ok(ApiResponse.success("Machine fetched successfully", machineService.getMachineById(id)));
    }

    @GetMapping()
    public ResponseEntity<ApiResponse<List<Machine>>> getAllMachines(){
        return ResponseEntity.ok(ApiResponse.success("Machines fetched successfully", machineService.getAllMachines()));
    }

    @PreAuthorize("hasRole ('HEAD')")
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteMachine(@PathVariable Long id){
        machineService.deleteMachineById(id);
        return ResponseEntity.ok(ApiResponse.<Void>success("Machine Deleted Successfully!", null));
    }

    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<DashboardResponse>> getAllMachinesDashboard(){
        return ResponseEntity.ok(ApiResponse.success("Dashboard fetched successfully", statusDashboardService.getStatusDashboard()));
    }

    @PatchMapping("/{id}/{status}")
    public ResponseEntity<ApiResponse<Machine>> updateMachineStatus(@PathVariable Long id, @PathVariable MachineStatus status){
        return ResponseEntity.ok(ApiResponse.success("Machine status updated successfully", machineService.changeMachineStatus(id, status)));
    }

}