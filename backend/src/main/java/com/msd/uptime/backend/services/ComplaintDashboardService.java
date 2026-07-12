package com.msd.uptime.backend.services;

import com.msd.uptime.backend.models.Complaint;
import com.msd.uptime.backend.models.Machine;
import com.msd.uptime.backend.repositories.ComplaintRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ComplaintDashboardService {

    @Autowired
    private ComplaintRepository complaintRepository;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    public List<Complaint> getComplaintList() {
        return complaintRepository.findAll();
    }

    public void publishComplaintDashboard(){
        System.out.println("Publishing Complaint update ...");
        messagingTemplate.convertAndSend("/topic/complaints", getComplaintList());
    }
}
