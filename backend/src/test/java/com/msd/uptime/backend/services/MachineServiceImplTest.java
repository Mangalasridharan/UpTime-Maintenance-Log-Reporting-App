package com.msd.uptime.backend.services;

import com.msd.uptime.backend.DTO.MachineRequest;
import com.msd.uptime.backend.models.Department;
import com.msd.uptime.backend.models.Machine;
import com.msd.uptime.backend.models.MachineStatus;
import com.msd.uptime.backend.repositories.DepartmentRepository;
import com.msd.uptime.backend.repositories.MachineRepository;
import com.msd.uptime.backend.support.TestDataFactory;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class MachineServiceImplTest {

    @Mock
    private DepartmentRepository departmentRepository;

    @Mock
    private MachineRepository machineRepository;

    @Mock
    private StatusDashboardService statusDashboardService;

    @Mock
    private ListDashboardService listDashboardService;

    @InjectMocks
    private MachineServiceImpl machineService;

    @Test
    void createMachine_linksDepartmentSavesAndPublishesListDashboard() {
        Department department = TestDataFactory.department(1L, "Mechanical");
        MachineRequest request = new MachineRequest("Lathe", 1L);

        when(departmentRepository.findDepartmentById(1L)).thenReturn(department);
        when(machineRepository.save(any(Machine.class))).thenAnswer(inv -> inv.getArgument(0));

        Machine result = machineService.createMachine(request);

        assertThat(result.getName()).isEqualTo("Lathe");
        assertThat(result.getDepartment()).isEqualTo(department);
        assertThat(result.getStatus()).isEqualTo(MachineStatus.IDLE);
        verify(machineRepository).save(result);
        verify(listDashboardService).publishListDashboard();
    }

    @Test
    void getMachineById_returnsMachineWhenPresent() {
        Machine machine = TestDataFactory.machine(1L, "Lathe", MachineStatus.RUNNING, null);
        when(machineRepository.findById(1L)).thenReturn(Optional.of(machine));

        assertThat(machineService.getMachineById(1L)).isEqualTo(machine);
    }

    @Test
    void getMachineById_returnsNullWhenMissing() {
        when(machineRepository.findById(99L)).thenReturn(Optional.empty());

        assertThat(machineService.getMachineById(99L)).isNull();
    }

    @Test
    void getAllMachines_returnsAllMachines() {
        when(machineRepository.findAll()).thenReturn(List.of(
                TestDataFactory.machine(1L, "Lathe", MachineStatus.RUNNING, null),
                TestDataFactory.machine(2L, "Drill", MachineStatus.IDLE, null)));

        assertThat(machineService.getAllMachines()).hasSize(2);
    }

    @Test
    void deleteMachineById_deletesAndPublishesDashboards() {
        machineService.deleteMachineById(7L);

        verify(machineRepository).deleteById(7L);
        verify(statusDashboardService).publishStatusDashboard();
        verify(listDashboardService).publishListDashboard();
    }

    @Test
    void changeMachineStatus_updatesStatusSavesAndPublishes() {
        Machine machine = TestDataFactory.machine(1L, "Lathe", MachineStatus.IDLE, null);
        when(machineRepository.findById(1L)).thenReturn(Optional.of(machine));
        when(machineRepository.save(any(Machine.class))).thenAnswer(inv -> inv.getArgument(0));

        Machine result = machineService.changeMachineStatus(1L, MachineStatus.UNDER_MAINTENANCE);

        assertThat(result.getStatus()).isEqualTo(MachineStatus.UNDER_MAINTENANCE);
        verify(machineRepository).save(machine);
        verify(statusDashboardService).publishStatusDashboard();
        verify(listDashboardService).publishListDashboard();

    }
}