package com.msd.uptime.backend.services;

import com.msd.uptime.backend.models.Machine;
import com.msd.uptime.backend.models.MachineStatus;
import com.msd.uptime.backend.repositories.MachineRepository;
import com.msd.uptime.backend.support.TestDataFactory;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ListDashboardServiceTest {

    @Mock
    private SimpMessagingTemplate messagingTemplate;

    @Mock
    private MachineRepository machineRepository;

    @InjectMocks
    private ListDashboardService listDashboardService;

    @Test
    void getListDashboard_returnsAllMachines() {
        when(machineRepository.findAll()).thenReturn(List.of(
                TestDataFactory.machine(1L, "Lathe", MachineStatus.RUNNING, null)));

        assertThat(listDashboardService.getListDashboard()).hasSize(1);
    }

    @Test
    void publishListDashboard_sendsMachineListToTopic() {
        List<Machine> machines = List.of(
                TestDataFactory.machine(1L, "Lathe", MachineStatus.RUNNING, null));
        when(machineRepository.findAll()).thenReturn(machines);

        listDashboardService.publishListDashboard();

        verify(messagingTemplate).convertAndSend(eq("/topic/machinelist"), eq(machines));
    }
}