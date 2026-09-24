package com.msd.uptime.backend.controllers;

import com.msd.uptime.backend.models.DailyLogTimeOfDay;
import com.msd.uptime.backend.models.DailyMachineLog;
import com.msd.uptime.backend.response.ApiResponse;
import com.msd.uptime.backend.services.DailyMachineLogService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/uptime/api/v1/machines/{machineId}/daily-logs")
@Tag(name = "Daily Machine Log", description = "Daily photo logs for a machine (morning, afternoon, evening)")
public class DailyMachineLogController {

    @Autowired
    private DailyMachineLogService dailyMachineLogService;

    @PreAuthorize("hasAnyRole ('SHIFT_WORKER', 'GENERAL_WORKER', 'HOD', 'HEAD')")
    @PostMapping("/upload")
    @Operation(summary = "Upload a daily photo log", description = "Uploads a photo for a machine per day and time-of-day slot. Re-uploading the same slot overwrites it.")
    public ResponseEntity<ApiResponse<DailyMachineLog>> uploadPhoto(
            @PathVariable Long machineId,
            @RequestParam Long employeeId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate logDate,
            @RequestParam DailyLogTimeOfDay timeOfDay,
            @RequestParam("photo") MultipartFile photo) {
        DailyMachineLog saved = dailyMachineLogService.uploadPhoto(machineId, employeeId, logDate, timeOfDay, photo);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Daily log uploaded successfully", saved));
    }

    @GetMapping()
    @Operation(summary = "Get daily logs for a date", description = "Returns the logs uploaded for a machine on a specific date, one per time-of-day slot.")
    public ResponseEntity<ApiResponse<List<DailyMachineLog>>> getLogsForDate(
            @PathVariable Long machineId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate logDate) {
        return ResponseEntity.ok(ApiResponse.success("Daily logs fetched successfully", dailyMachineLogService.getLogsForDate(machineId, logDate)));
    }
}