package com.msd.uptime.backend.services;

import com.msd.uptime.backend.DTO.ComplaintRequest;
import com.msd.uptime.backend.events.NotificationEvent;
import com.msd.uptime.backend.models.Complaint;
import com.msd.uptime.backend.models.ComplaintStatus;
import com.msd.uptime.backend.models.Department;
import com.msd.uptime.backend.models.Employee;
import com.msd.uptime.backend.models.EmployeeRole;
import com.msd.uptime.backend.models.Machine;
import com.msd.uptime.backend.models.MachineStatus;
import com.msd.uptime.backend.models.MaintenanceLogs;
import com.msd.uptime.backend.models.Specialization;
import com.msd.uptime.backend.repositories.ComplaintRepository;
import com.msd.uptime.backend.repositories.EmployeeRepository;
import com.msd.uptime.backend.repositories.MachineRepository;
import com.msd.uptime.backend.repositories.MaintenanceLogRepository;
import com.msd.uptime.backend.support.TestDataFactory;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.context.ApplicationEventPublisher;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ComplaintServiceImplTest {

    @Mock
    private ComplaintRepository complaintRepository;

    @Mock
    private MachineRepository machineRepository;

    @Mock
    private EmployeeRepository employeeRepository;

    @Mock
    private ListDashboardService listDashboardService;

    @Mock
    private ComplaintDashboardService complaintDashboardService;

    @Mock
    private StatusDashboardService statusDashboardService;

    @Mock
    private ApplicationEventPublisher publisher;

    @Mock
    private MaintenanceLogRepository maintenanceLogRepository;

    @InjectMocks
    private ComplaintServiceImpl complaintService;

    @Test
    void getAllComplaints_returnsAllComplaints() {
        when(complaintRepository.findAll()).thenReturn(List.of(
                TestDataFactory.complaint(1L, "Repair", null, null, ComplaintStatus.OPEN, null)));

        assertThat(complaintService.getAllComplaints()).hasSize(1);
    }

    @Test
    void createComplaint_flipsMachineToIdleSavesPublishesAndFiresEvent() {
        Department department = TestDataFactory.department(1L, "Maintenance");
        Machine machine = TestDataFactory.machine(1L, "Lathe", MachineStatus.RUNNING, department);
        Employee employee = TestDataFactory.employee(1L, "jadoo", "jadoo@test.com",
                EmployeeRole.SHIFT_WORKER, department, Specialization.MECHANICAL);

        ComplaintRequest request = new ComplaintRequest("Belt snapped", 1L, 1L);

        when(machineRepository.findMachineById(1L)).thenReturn(machine);
        when(employeeRepository.getOne(1L)).thenReturn(employee);
        when(complaintRepository.save(any(Complaint.class))).thenAnswer(inv -> inv.getArgument(0));

        Complaint result = complaintService.createComplaint(request);

        assertThat(result.getStatus()).isEqualTo(ComplaintStatus.OPEN);
        assertThat(result.getDescription()).isEqualTo("Belt snapped");
        assertThat(result.getMachine()).isSameAs(machine);
        assertThat(result.getReportedBy()).isSameAs(employee);
        assertThat(machine.getStatus()).isEqualTo(MachineStatus.IDLE);

        verify(machineRepository).save(machine);
        verify(complaintRepository).save(result);
        verify(maintenanceLogRepository).save(any(MaintenanceLogs.class));
        verify(publisher).publishEvent(any(NotificationEvent.class));
        verify(listDashboardService).publishListDashboard();
        verify(complaintDashboardService).publishComplaintDashboard();
        verify(statusDashboardService).publishStatusDashboard();
    }

    @Test
    void assignComplaint_assignsEmployeeAndMarksMachineUnderMaintenance() {
        Department department = TestDataFactory.department(1L, "Maintenance");
        Machine machine = TestDataFactory.machine(1L, "Lathe", MachineStatus.IDLE, department);
        Employee reporter = TestDataFactory.employee(1L, "worker", "worker@test.com",
                EmployeeRole.SHIFT_WORKER, department, Specialization.MECHANICAL);
        Employee assignee = TestDataFactory.employee(2L, "hod", "hod@test.com",
                EmployeeRole.HOD, department, null);
        Complaint complaint = TestDataFactory
                .complaint(10L, "Belt snapped", machine, reporter, ComplaintStatus.OPEN, null);

        when(complaintRepository.getById(10L)).thenReturn(complaint);
        when(employeeRepository.getOne(2L)).thenReturn(assignee);
        when(complaintRepository.save(complaint)).thenReturn(complaint);

        Complaint result = complaintService.assignComplaint(10L, 2L);

        assertThat(result.getStatus()).isEqualTo(ComplaintStatus.ASSIGNED);
        assertThat(result.getAssignedTo()).isEqualTo(assignee);
        assertThat(machine.getStatus()).isEqualTo(MachineStatus.UNDER_MAINTENANCE);
        verify(machineRepository).save(machine);
        verify(complaintRepository).save(complaint);
        verify(listDashboardService).publishListDashboard();
        verify(complaintDashboardService).publishComplaintDashboard();
        verify(statusDashboardService).publishStatusDashboard();
    }

    @Test
    void completeComplaint_marksCompletedAndPublishesComplaintDashboardOnly() {
        Complaint complaint = TestDataFactory
                .complaint(10L, "Belt snapped", null, null, ComplaintStatus.ASSIGNED, null);
        when(complaintRepository.getById(10L)).thenReturn(complaint);
        when(complaintRepository.save(complaint)).thenReturn(complaint);

        Complaint result = complaintService.completeComplaint(10L);

        assertThat(result.getStatus()).isEqualTo(ComplaintStatus.COMPLETED);
        verify(complaintDashboardService).publishComplaintDashboard();
        verify(listDashboardService, never()).publishListDashboard();
        verify(statusDashboardService, never()).publishStatusDashboard();
    }

    @Test
    void verifyComplaint_marksVerifiedAndSetsMachineRunning() {
        Machine machine = TestDataFactory.machine(1L, "Lathe", MachineStatus.IDLE, null);
        Complaint complaint = TestDataFactory
                .complaint(10L, "Belt snapped", machine, null, ComplaintStatus.COMPLETED, null);
        when(complaintRepository.getById(10L)).thenReturn(complaint);
        when(complaintRepository.save(complaint)).thenReturn(complaint);

        Complaint result = complaintService.verifyComplaint(10L);

        assertThat(result.getStatus()).isEqualTo(ComplaintStatus.VERIFIED);
        assertThat(machine.getStatus()).isEqualTo(MachineStatus.RUNNING);
        verify(machineRepository).save(machine);
        verify(listDashboardService).publishListDashboard();
        verify(complaintDashboardService).publishComplaintDashboard();
        verify(statusDashboardService).publishStatusDashboard();
    }
}