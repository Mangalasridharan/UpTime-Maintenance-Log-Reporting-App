package com.msd.uptime.backend.controllers;

import com.msd.uptime.backend.DTO.DashboardResponse;
import com.msd.uptime.backend.DTO.MachineRequest;
import com.msd.uptime.backend.DTO.MachineWorkHistory;
import com.msd.uptime.backend.models.Machine;
import com.msd.uptime.backend.models.MachineStatus;
import com.msd.uptime.backend.response.ApiResponse;
import com.msd.uptime.backend.services.StatusDashboardService;
import com.msd.uptime.backend.services.MachineService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/uptime/api/v1/machines")
@Tag(name = "Machine", description = "Machine CRUD, status updates and dashboard")
public class MachineController {

    @Autowired
    private MachineService machineService;

    @Autowired
    private StatusDashboardService statusDashboardService;

    @PreAuthorize("hasRole ('HEAD')")
    @PostMapping()
    @Operation(summary = "Create a machine (HEAD only)")
    public ResponseEntity<ApiResponse<Machine>> createMachine(@RequestBody MachineRequest machineRequest){
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Machine created successfully", machineService.createMachine(machineRequest)));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get a machine by ID")
    public ResponseEntity<ApiResponse<Machine>> getMachine(@PathVariable Long id){
        return ResponseEntity.ok(ApiResponse.success("Machine fetched successfully", machineService.getMachineById(id)));
    }

    @GetMapping()
    @Operation(summary = "Get all machines")
    public ResponseEntity<ApiResponse<List<Machine>>> getAllMachines(){
        return ResponseEntity.ok(ApiResponse.success("Machines fetched successfully", machineService.getAllMachines()));
    }

    @GetMapping("/{id}/history")
    @Operation(summary = "Get a machine's work history", description = "Returns the machine together with its complaints and maintenance logs, newest first.")
    public ResponseEntity<ApiResponse<MachineWorkHistory>> getMachineWorkHistory(@PathVariable Long id){
        return ResponseEntity.ok(ApiResponse.success("Machine work history fetched successfully", machineService.getMachineWorkHistory(id)));
    }

    @PreAuthorize("hasRole ('HEAD')")
    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a machine (HEAD only)")
    public ResponseEntity<ApiResponse<Void>> deleteMachine(@PathVariable Long id){
        machineService.deleteMachineById(id);
        return ResponseEntity.ok(ApiResponse.<Void>success("Machine Deleted Successfully!", null));
    }

    @GetMapping("/dashboard")
    @Operation(summary = "Get machine status dashboard", description = "Counts of total, running, idle and under-maintenance machines, also pushed over WebSocket at /topic/dashboard.")
    public ResponseEntity<ApiResponse<DashboardResponse>> getAllMachinesDashboard(){
        return ResponseEntity.ok(ApiResponse.success("Dashboard fetched successfully", statusDashboardService.getStatusDashboard()));
    }

    @PatchMapping("/{id}/{status}")
    @Operation(summary = "Update a machine's status")
    public ResponseEntity<ApiResponse<Machine>> updateMachineStatus(@PathVariable Long id, @PathVariable MachineStatus status){
        return ResponseEntity.ok(ApiResponse.success("Machine status updated successfully", machineService.changeMachineStatus(id, status)));
    }

}