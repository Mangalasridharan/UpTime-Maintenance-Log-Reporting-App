package com.msd.uptime.backend.services;

import com.msd.uptime.backend.DTO.MachineRequest;
import com.msd.uptime.backend.models.Department;
import com.msd.uptime.backend.models.Machine;
import com.msd.uptime.backend.models.MachineStatus;
import com.msd.uptime.backend.repositories.DepartmentRepository;
import com.msd.uptime.backend.repositories.MachineRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MachineServiceImpl implements MachineService {

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private MachineRepository machineRepository;

    @Autowired
    private StatusDashboardService statusDashboardService;

    @Autowired
    private ListDashboardService listDashboardService;

    public Machine createMachine(MachineRequest machineRequest){

        Department department = departmentRepository.findDepartmentById(machineRequest.departmentId());
        Machine machine = new Machine();
        machine.setName(machineRequest.name());
        machine.setDepartment(department);
        Machine saved =  machineRepository.save(machine);
        listDashboardService.publishListDashboard();
        return saved;
    }

    public Machine getMachineById(Long id){
        return machineRepository.findById(id).orElse(null);
    }

    public List<Machine> getAllMachines(){
        return machineRepository.findAll();
    }

    public void deleteMachineById(Long id){
        machineRepository.deleteById(id);
        statusDashboardService.publishStatusDashboard();
        listDashboardService.publishListDashboard();
    }

    public Machine changeMachineStatus(Long id, MachineStatus machineStatus){
        Machine machine = getMachineById(id);
        machine.setStatus(machineStatus);
        machineRepository.save(machine);

        statusDashboardService.publishStatusDashboard();
        listDashboardService.publishListDashboard();
        return machine;
    }

}
