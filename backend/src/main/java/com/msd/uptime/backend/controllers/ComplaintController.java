package com.msd.uptime.backend.controllers;

import com.msd.uptime.backend.DTO.ComplaintRequest;
import com.msd.uptime.backend.models.Complaint;
import com.msd.uptime.backend.services.ComplaintService;
import org.springframework.beans.factory.annotation.Autowired;
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
    public Complaint createComplaint(@RequestBody ComplaintRequest complaint){
        return complaintService.createComplaint(complaint);
    }

    @PreAuthorize("hasAnyRole ('HOD', 'HEAD')")
    @PatchMapping("/{id}/assign")
    public Complaint assignComplaint(@PathVariable("id") Long complaint_id, @RequestParam(name="id") Long employee_id){
        return complaintService.assignComplaint(complaint_id, employee_id);
    }

    @PreAuthorize("hasAnyRole ('SHIFT_WORKER', 'GENERAL_WORKER')")
    @PatchMapping("/{id}/resolve")
    public Complaint resolveComplaint(@PathVariable Long complaint_id){
        return complaintService.completeComplaint(complaint_id);
    }

    @PreAuthorize("hasAnyRole ('HEAD')")
    @PatchMapping("/{id}/verify")
    public Complaint verifyComplaint(@PathVariable Long complaint_id){
        return complaintService.completeComplaint(complaint_id);
    }

    @GetMapping()
    public List<Complaint> getComplaintList(){
        return complaintService.getAllComplaints();
    }


}
