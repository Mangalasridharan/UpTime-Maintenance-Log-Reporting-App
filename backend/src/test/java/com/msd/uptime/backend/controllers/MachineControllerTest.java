package com.msd.uptime.backend.controllers;

import com.msd.uptime.backend.DTO.DashboardResponse;
import com.msd.uptime.backend.DTO.MachineRequest;
import com.msd.uptime.backend.models.Machine;
import com.msd.uptime.backend.models.MachineStatus;
import com.msd.uptime.backend.services.MachineService;
import com.msd.uptime.backend.services.StatusDashboardService;
import com.msd.uptime.backend.support.TestDataFactory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
class MachineControllerTest {

    @Mock
    private MachineService machineService;

    @Mock
    private StatusDashboardService statusDashboardService;

    @InjectMocks
    private MachineController machineController;

    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(machineController).build();
    }

    @Test
    void createMachine_delegatesToService() throws Exception {
        Machine saved = TestDataFactory.machine(1L, "Lathe", MachineStatus.IDLE, null);
        when(machineService.createMachine(any(MachineRequest.class))).thenReturn(saved);

        mockMvc.perform(post("/uptime/api/v1/machines")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"name\":\"Lathe\",\"departmentId\":1}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Lathe"));
    }

    @Test
    void getMachine_delegatesToService() throws Exception {
        when(machineService.getMachineById(1L))
                .thenReturn(TestDataFactory.machine(1L, "Lathe", MachineStatus.RUNNING, null));

        mockMvc.perform(get("/uptime/api/v1/machines/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("RUNNING"));
    }

    @Test
    void getAllMachines_returnsList() throws Exception {
        when(machineService.getAllMachines()).thenReturn(List.of(
                TestDataFactory.machine(1L, "Lathe", MachineStatus.RUNNING, null)));

        mockMvc.perform(get("/uptime/api/v1/machines"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1));
    }

    @Test
    void deleteMachine_delegatesAndReturnsMessage() throws Exception {
        mockMvc.perform(delete("/uptime/api/v1/machines/8"))
                .andExpect(status().isOk())
                .andExpect(content().string("Machine Deleted Successfully!"));

        verify(machineService).deleteMachineById(8L);
    }

    @Test
    void getDashboard_returnsDashboardResponse() throws Exception {
        when(statusDashboardService.getStatusDashboard())
                .thenReturn(new DashboardResponse(5L, 2L, 2L, 1L));

        mockMvc.perform(get("/uptime/api/v1/machines/dashboard"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalMachines").value(5))
                .andExpect(jsonPath("$.runningMachines").value(2));
    }

    @Test
    void updateMachineStatus_delegatesToService() throws Exception {
        Machine machine = TestDataFactory.machine(1L, "Lathe", MachineStatus.UNDER_MAINTENANCE, null);
        when(machineService.changeMachineStatus(anyLong(), any(MachineStatus.class))).thenReturn(machine);

        mockMvc.perform(patch("/uptime/api/v1/machines/1/UNDER_MAINTENANCE"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("UNDER_MAINTENANCE"));
    }
}