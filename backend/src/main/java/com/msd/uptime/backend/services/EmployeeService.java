package com.msd.uptime.backend.services;
import com.msd.uptime.backend.DTO.Employee.EmployeeLoginRequest;
import com.msd.uptime.backend.DTO.Employee.EmployeeLoginResponse;
import com.msd.uptime.backend.DTO.Employee.EmployeeRegisterRequest;
import com.msd.uptime.backend.models.Employee;

import java.util.List;

public interface EmployeeService
{
    Employee getUserById(Long id);
    List<Employee> getAllUsers();
    void deleteUserById(Long id);

    Employee register(EmployeeRegisterRequest registerRequest);
    EmployeeLoginResponse authenticate(EmployeeLoginRequest loginRequest);
}
