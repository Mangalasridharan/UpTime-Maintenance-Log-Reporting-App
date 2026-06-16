package com.msd.uptime.backend.services;
import com.msd.uptime.backend.models.Employee;

import java.util.List;

public interface EmployeeService
{
    Employee getUserById(Long id);
    List<Employee> getAllUsers();
    void deleteUserById(Long id);

    Employee register(Employee employee);
    String authenticate(String email, String password);
}
