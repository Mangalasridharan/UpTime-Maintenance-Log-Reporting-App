package com.msd.uptime.backend.controllers;

import com.msd.uptime.backend.models.Complaint;
import com.msd.uptime.backend.services.ComplaintService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/user/api/v1/complaint")
public class ComplaintController {

    @Autowired
    private ComplaintService complaintService;

//    @PostMapping()
//    public Complaint createComplaint(@RequestBody Complaint complaint){
//        return complaintService.createComplaint(complaint);
//    }
}
