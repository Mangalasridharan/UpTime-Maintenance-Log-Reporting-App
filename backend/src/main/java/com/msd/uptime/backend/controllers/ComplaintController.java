package com.msd.uptime.backend.controllers;

import com.msd.uptime.backend.DTO.ComplaintRequest;
import com.msd.uptime.backend.models.Complaint;
import com.msd.uptime.backend.response.ApiResponse;
import com.msd.uptime.backend.services.ComplaintService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/uptime/api/v1/complaint")
public class ComplaintController {

    @Autowired
    private ComplaintService complaintService;

    @PreAuthorize("hasAnyRole ('SHIFT_WORKER', 'GENERAL_WORKER', 'HOD', 'HEAD')")
    @PostMapping()
    public ResponseEntity<ApiResponse<Complaint>> createComplaint(@RequestBody ComplaintRequest complaint){
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Complaint created successfully", complaintService.createComplaint(complaint)));
    }

    @PreAuthorize("hasAnyRole ('HOD', 'HEAD')")
    @PatchMapping("/{id}/assign")
    public ResponseEntity<ApiResponse<Complaint>> assignComplaint(@PathVariable("id") Long complaint_id, @RequestParam(name="id") Long employee_id){
        return ResponseEntity.ok(ApiResponse.success("Complaint assigned successfully", complaintService.assignComplaint(complaint_id, employee_id)));
    }

    @PreAuthorize("hasAnyRole ('SHIFT_WORKER', 'GENERAL_WORKER')")
    @PatchMapping("/{id}/resolve")
    public ResponseEntity<ApiResponse<Complaint>> resolveComplaint(@PathVariable("id") Long complaint_id){
        return ResponseEntity.ok(ApiResponse.success("Complaint resolved successfully", complaintService.completeComplaint(complaint_id)));
    }

    @PreAuthorize("hasAnyRole ('HEAD')")
    @PatchMapping("/{id}/verify")
    public ResponseEntity<ApiResponse<Complaint>> verifyComplaint(@PathVariable("id") Long complaint_id){
        return ResponseEntity.ok(ApiResponse.success("Complaint verified successfully", complaintService.verifyComplaint(complaint_id)));
    }

    @GetMapping()
    public ResponseEntity<ApiResponse<List<Complaint>>> getComplaintList(){
        return ResponseEntity.ok(ApiResponse.success("Complaints fetched successfully", complaintService.getAllComplaints()));
    }

}