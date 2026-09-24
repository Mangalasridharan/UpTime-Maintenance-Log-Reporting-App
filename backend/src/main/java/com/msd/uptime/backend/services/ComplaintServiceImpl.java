package com.msd.uptime.backend.services;

import com.msd.uptime.backend.DTO.ComplaintRequest;
import com.msd.uptime.backend.events.NotificationEvent;
import com.msd.uptime.backend.models.*;
import com.msd.uptime.backend.repositories.ComplaintRepository;
import com.msd.uptime.backend.repositories.EmployeeRepository;
import com.msd.uptime.backend.repositories.MachineRepository;
import com.msd.uptime.backend.repositories.MaintenanceLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ComplaintServiceImpl implements ComplaintService {

    @Autowired
    private ComplaintRepository complaintRepository;

    @Autowired
    private MachineRepository machineRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private ListDashboardService listDashboardService;

    @Autowired
    private ComplaintDashboardService complaintDashboardService;

    @Autowired
    private StatusDashboardService statusDashboardService;

    @Autowired
    private ApplicationEventPublisher publisher;

    @Autowired
    private MaintenanceLogRepository maintenanceLogRepository;

    public List<Complaint> getAllComplaints(){
        return complaintRepository.findAll();
    }

    public Complaint createComplaint(ComplaintRequest complaint) {
        Machine machine = machineRepository.findMachineById(complaint.machineId());
        machine.setStatus(MachineStatus.IDLE);
        machineRepository.save(machine);
        Employee reported_by = employeeRepository.getOne(complaint.employeeId());

        Complaint complaintEntry = new Complaint();
        complaintEntry.setDescription(complaint.description());
        complaintEntry.setMachine(machine);
        complaintEntry.setReportedBy(reported_by);
        complaintEntry.setStatus(ComplaintStatus.OPEN);
        Complaint saved =  complaintRepository.save(complaintEntry);

        MaintenanceLogs maintenanceLog = new MaintenanceLogs();
        maintenanceLog.setMachine(machine);
        maintenanceLog.setReportedBy(reported_by);
        maintenanceLog.setComplaint(saved);
        maintenanceLog.setWorkType(WorkType.PREVENTIVE);
        maintenanceLog.setStatus(MaintenanceStatus.PENDING);
        maintenanceLog.setReportedAt(saved.getReportedAt());
        maintenanceLogRepository.save(maintenanceLog);

        publisher.publishEvent(new NotificationEvent(
                reported_by.getId(),
                "New Complaint Raised",
                reported_by.getUsername() +
                        " has raised a complaint on " +
                        machine.getName(),
                NotificationType.BOTH
        ));

        listDashboardService.publishListDashboard();
        complaintDashboardService.publishComplaintDashboard();
        statusDashboardService.publishStatusDashboard();
        return saved;
    }

    public Complaint assignComplaint(Long complaint_id, Long employee_id){
        Complaint complaintEntry = complaintRepository.getById(complaint_id);
        Employee assigned_to = employeeRepository.getOne(employee_id);

        complaintEntry.setAssignedTo(assigned_to);
        complaintEntry.setStatus(ComplaintStatus.ASSIGNED);
        Machine machine = complaintEntry.getMachine();
        if (machine != null) {
            machine.setStatus(MachineStatus.UNDER_MAINTENANCE);
            machineRepository.save(machine);
        }
        Complaint saved =  complaintRepository.save(complaintEntry);

        listDashboardService.publishListDashboard();
        complaintDashboardService.publishComplaintDashboard();
        statusDashboardService.publishStatusDashboard();
        return saved;
    }

    public Complaint completeComplaint(Long complaint_id){
        Complaint complaintEntry = complaintRepository.getById(complaint_id);
        complaintEntry.setStatus(ComplaintStatus.COMPLETED);
        Complaint saved =  complaintRepository.save(complaintEntry);
        complaintDashboardService.publishComplaintDashboard();
        return saved;
    }

    public Complaint verifyComplaint(Long complaint_id){
        Complaint complaintEntry = complaintRepository.getById(complaint_id);
        complaintEntry.setStatus(ComplaintStatus.VERIFIED);
        Machine machine = complaintEntry.getMachine();
        if (machine != null) {
            machine.setStatus(MachineStatus.RUNNING);
            machineRepository.save(machine);
        }

        Complaint saved =  complaintRepository.save(complaintEntry);
        listDashboardService.publishListDashboard();
        complaintDashboardService.publishComplaintDashboard();
        statusDashboardService.publishStatusDashboard();
        return saved;
    }
}
