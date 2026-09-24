package com.msd.uptime.backend.controllers;

import com.msd.uptime.backend.DTO.ComplaintRequest;
import com.msd.uptime.backend.models.Complaint;
import com.msd.uptime.backend.response.ApiResponse;
import com.msd.uptime.backend.services.ComplaintService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/uptime/api/v1/complaint")
@Tag(name = "Complaint", description = "Complaint lifecycle: create, assign, resolve, verify and list")
public class ComplaintController {

    @Autowired
    private ComplaintService complaintService;

    @PreAuthorize("hasAnyRole ('SHIFT_WORKER', 'GENERAL_WORKER', 'HOD', 'HEAD')")
    @PostMapping()
    @Operation(summary = "Create a complaint", description = "Raises a complaint against a machine and flips the machine to IDLE.")
    public ResponseEntity<ApiResponse<Complaint>> createComplaint(@RequestBody ComplaintRequest complaint){
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Complaint created successfully", complaintService.createComplaint(complaint)));
    }

    @PreAuthorize("hasAnyRole ('HOD', 'HEAD')")
    @PatchMapping("/{id}/assign")
    @Operation(summary = "Assign a complaint to an employee (HOD or HEAD)")
    public ResponseEntity<ApiResponse<Complaint>> assignComplaint(@PathVariable("id") Long complaint_id, @RequestParam(name="id") Long employee_id){
        return ResponseEntity.ok(ApiResponse.success("Complaint assigned successfully", complaintService.assignComplaint(complaint_id, employee_id)));
    }

    @PreAuthorize("hasAnyRole ('SHIFT_WORKER', 'GENERAL_WORKER')")
    @PatchMapping("/{id}/resolve")
    @Operation(summary = "Resolve a complaint (SHIFT or GENERAL worker)")
    public ResponseEntity<ApiResponse<Complaint>> resolveComplaint(@PathVariable("id") Long complaint_id){
        return ResponseEntity.ok(ApiResponse.success("Complaint resolved successfully", complaintService.completeComplaint(complaint_id)));
    }

    @PreAuthorize("hasAnyRole ('HEAD')")
    @PatchMapping("/{id}/verify")
    @Operation(summary = "Verify a resolved complaint (HEAD only)", description = "Marks the complaint VERIFIED and sets its machine back to RUNNING.")
    public ResponseEntity<ApiResponse<Complaint>> verifyComplaint(@PathVariable("id") Long complaint_id){
        return ResponseEntity.ok(ApiResponse.success("Complaint verified successfully", complaintService.verifyComplaint(complaint_id)));
    }

    @GetMapping()
    @Operation(summary = "Get all complaints")
    public ResponseEntity<ApiResponse<List<Complaint>>> getComplaintList(){
        return ResponseEntity.ok(ApiResponse.success("Complaints fetched successfully", complaintService.getAllComplaints()));
    }

}