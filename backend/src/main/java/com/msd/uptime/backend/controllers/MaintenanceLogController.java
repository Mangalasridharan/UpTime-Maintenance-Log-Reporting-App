package com.msd.uptime.backend.controllers;

import com.msd.uptime.backend.models.MaintenanceLogs;
import com.msd.uptime.backend.models.WorkType;
import com.msd.uptime.backend.response.ApiResponse;
import com.msd.uptime.backend.services.MaintenanceLogService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/uptime/api/v1/maintenance-log")
@Tag(name = "Maintenance Log", description = "Maintenance log management: create, list, and switch work type")
public class MaintenanceLogController {

    @Autowired
    private MaintenanceLogService maintenanceLogService;

    @GetMapping()
    @Operation(summary = "Get all maintenance logs")
    public ResponseEntity<ApiResponse<List<MaintenanceLogs>>> getAllMaintenanceLogs() {
        return ResponseEntity.ok(ApiResponse.success("Maintenance logs fetched successfully",
                maintenanceLogService.getAllMaintenanceLogs()));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get a maintenance log by id")
    public ResponseEntity<ApiResponse<MaintenanceLogs>> getMaintenanceLogById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Maintenance log fetched successfully",
                maintenanceLogService.getMaintenanceLogById(id)));
    }

    @GetMapping("/complaint/{complaintId}")
    @Operation(summary = "Get maintenance log by complaint id")
    public ResponseEntity<ApiResponse<MaintenanceLogs>> getMaintenanceLogByComplaintId(@PathVariable Long complaintId) {
        return ResponseEntity.ok(ApiResponse.success("Maintenance log fetched successfully",
                maintenanceLogService.getMaintenanceLogByComplaintId(complaintId)));
    }

    @PreAuthorize("hasAnyRole('SHIFT_WORKER', 'GENERAL_WORKER')")
    @PatchMapping("/{id}/switch-work-type")
    @Operation(summary = "Switch work type of a maintenance log",
            description = "Allows a machine operator to switch the work type (e.g. from PREVENTIVE to BREAKDOWN) in a single click.")
    public ResponseEntity<ApiResponse<MaintenanceLogs>> switchWorkType(
            @PathVariable Long id,
            @RequestParam WorkType workType) {
        return ResponseEntity.ok(ApiResponse.success("Work type switched to " + workType,
                maintenanceLogService.switchWorkType(id, workType)));
    }
}
