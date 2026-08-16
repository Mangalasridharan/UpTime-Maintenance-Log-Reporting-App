package com.msd.uptime.backend.services;

import com.msd.uptime.backend.DTO.DashboardResponse;
import com.msd.uptime.backend.models.MachineStatus;
import com.msd.uptime.backend.repositories.MachineRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
public class StatusDashboardService {
    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private MachineRepository machineRepository;

    public DashboardResponse getStatusDashboard(){
        Long totalMachines = machineRepository.count();
        Long runningMachines = machineRepository.countByStatus(MachineStatus.RUNNING);
        Long idleMachines = machineRepository.countByStatus(MachineStatus.IDLE);
        Long underMaintenanceMachines = machineRepository.countByStatus(MachineStatus.UNDER_MAINTENANCE);

        return new DashboardResponse(

                totalMachines,
                runningMachines,
                idleMachines,
                underMaintenanceMachines
        );
    }
    public void publishStatusDashboard(){
        System.out.println("Publishing dashboard update...");
        messagingTemplate.convertAndSend("/topic/dashboard", getStatusDashboard());
    }
}
