package com.msd.uptime.backend.services;

import com.msd.uptime.backend.DTO.MachineRequest;
import com.msd.uptime.backend.models.Department;
import com.msd.uptime.backend.models.Machine;
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

    public Machine createMachine(MachineRequest machineRequest){

        Department department = departmentRepository.findDepartmentById(machineRequest.getDepartmentId());
        Machine machine = new Machine();
        machine.setName(machineRequest.getName());
        machine.setDepartment(department);
        return machineRepository.save(machine);
    }

    public Machine getMachineById(Long id){
        return machineRepository.findById(id).orElse(null);
    }

    public List<Machine> getAllMachines(){
        return machineRepository.findAll();
    }

    public void deleteMachineById(Long id){
        machineRepository.deleteById(id);
    }
}
