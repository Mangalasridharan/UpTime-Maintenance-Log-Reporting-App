package com.msd.uptime.backend.services;

import com.msd.uptime.backend.models.Machine;
import com.msd.uptime.backend.repositories.MachineRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ListDashboardService {
    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private MachineRepository machineRepository;

    public List<Machine> getListDashboard() {
        return machineRepository.findAll();
    }

    public void publishListDashboard(){
        System.out.println("Publishing LIST dashboard update...");
        messagingTemplate.convertAndSend("/topic/machinelist", getListDashboard());
    }
}
