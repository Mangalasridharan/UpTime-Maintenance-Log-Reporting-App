package com.msd.uptime.backend.services;

import com.msd.uptime.backend.DTO.DashboardResponse;
import com.msd.uptime.backend.models.MachineStatus;
import com.msd.uptime.backend.repositories.MachineRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class StatusDashboardServiceTest {

    @Mock
    private SimpMessagingTemplate messagingTemplate;

    @Mock
    private MachineRepository machineRepository;

    @InjectMocks
    private StatusDashboardService statusDashboardService;

    @Test
    void getStatusDashboard_aggregatesMachineCountsByStatus() {
        when(machineRepository.count()).thenReturn(5L);
        when(machineRepository.countByStatus(MachineStatus.RUNNING)).thenReturn(2L);
        when(machineRepository.countByStatus(MachineStatus.IDLE)).thenReturn(2L);
        when(machineRepository.countByStatus(MachineStatus.UNDER_MAINTENANCE)).thenReturn(1L);

        DashboardResponse response = statusDashboardService.getStatusDashboard();

        assertThat(response.totalMachines()).isEqualTo(5L);
        assertThat(response.runningMachines()).isEqualTo(2L);
        assertThat(response.idleMachines()).isEqualTo(2L);
        assertThat(response.underMaintenanceMachines()).isEqualTo(1L);
    }

    @Test
    void publishStatusDashboard_sendsDashboardToTopic() {
        DashboardResponse response =
                new DashboardResponse(3L, 1L, 1L, 1L);
        when(machineRepository.count()).thenReturn(3L);
        when(machineRepository.countByStatus(MachineStatus.RUNNING)).thenReturn(1L);
        when(machineRepository.countByStatus(MachineStatus.IDLE)).thenReturn(1L);
        when(machineRepository.countByStatus(MachineStatus.UNDER_MAINTENANCE)).thenReturn(1L);

        statusDashboardService.publishStatusDashboard();

        verify(messagingTemplate).convertAndSend(eq("/topic/dashboard"), eq(response));
    }
}