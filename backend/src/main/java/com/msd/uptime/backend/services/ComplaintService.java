package com.msd.uptime.backend.services;

import com.msd.uptime.backend.DTO.ComplaintRequest;
import com.msd.uptime.backend.models.Complaint;
import org.springframework.stereotype.Service;

public interface ComplaintService  {
    Complaint createComplaint(ComplaintRequest complaint);
    Complaint assignComplaint(Long complaint_id,Long employee_id);
    Complaint completeComplaint(Long complaint_id);
    Complaint verifyComplaint(Long complaint_id);
}
