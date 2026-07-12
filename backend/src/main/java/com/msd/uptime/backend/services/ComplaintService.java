package com.msd.uptime.backend.services;

import com.msd.uptime.backend.DTO.ComplaintRequest;
import com.msd.uptime.backend.models.Complaint;

import java.util.List;

public interface ComplaintService  {
    List<Complaint> getAllComplaints();
    Complaint createComplaint(ComplaintRequest complaint);
    Complaint assignComplaint(Long complaint_id, Long employee_id);
    Complaint completeComplaint(Long complaint_id);
    Complaint verifyComplaint(Long complaint_id);

}
