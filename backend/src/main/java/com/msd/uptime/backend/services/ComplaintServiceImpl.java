package com.msd.uptime.backend.services;

import com.msd.uptime.backend.models.Complaint;
import com.msd.uptime.backend.repositories.ComplaintRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ComplaintServiceImpl implements ComplaintService {

    @Autowired
    private ComplaintRepository complaintRepository;

//    @Override
//    public Complaint createComplaint(Complaint complaint) {
//            return;
//    }
}
