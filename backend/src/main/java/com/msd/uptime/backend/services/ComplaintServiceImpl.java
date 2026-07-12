package com.msd.uptime.backend.services;

import com.msd.uptime.backend.DTO.ComplaintRequest;
import com.msd.uptime.backend.models.*;
import com.msd.uptime.backend.repositories.ComplaintRepository;
import com.msd.uptime.backend.repositories.EmployeeRepository;
import com.msd.uptime.backend.repositories.MachineRepository;
import org.springframework.beans.factory.annotation.Autowired;
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

    public List<Complaint> getAllComplaints(){
        return complaintRepository.findAll();
    }

    public Complaint createComplaint(ComplaintRequest complaint) {
        Machine machine = machineRepository.findMachineById(complaint.getMachineId());
        machine.setStatus(MachineStatus.IDLE);
        Employee reported_by = employeeRepository.getOne(complaint.getEmployeeId());

        Complaint complaintEntry = new Complaint();
        complaintEntry.setDescription(complaint.getDescription());
        complaintEntry.setMachine(machine);
        complaintEntry.setReportedBy(reported_by);
        complaintEntry.setStatus(ComplaintStatus.OPEN);
        Complaint saved =  complaintRepository.save(complaintEntry);

        listDashboardService.publishListDashboard();
        complaintDashboardService.publishComplaintDashboard();
        return saved;
    }

    public Complaint assignComplaint(Long complaint_id, Long employee_id){
        Complaint complaintEntry = complaintRepository.getById(complaint_id);
        Employee assigned_to = employeeRepository.getOne(employee_id);

        complaintEntry.setAssignedTo(assigned_to);
        complaintEntry.setStatus(ComplaintStatus.ASSIGNED);
        complaintEntry.getMachine().setStatus(MachineStatus.UNDER_MAINTENANCE);
        Complaint saved =  complaintRepository.save(complaintEntry);

        complaintDashboardService.publishComplaintDashboard();
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
        complaintEntry.getMachine().setStatus(MachineStatus.RUNNING);

        Complaint saved =  complaintRepository.save(complaintEntry);
        complaintDashboardService.publishComplaintDashboard();
        return saved;
    }
}
