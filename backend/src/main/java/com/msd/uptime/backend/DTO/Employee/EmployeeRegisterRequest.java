package com.msd.uptime.backend.DTO.Employee;

import com.msd.uptime.backend.models.EmployeeRole;
import com.msd.uptime.backend.models.Specialization;

public record EmployeeRegisterRequest(
        String username,
        String email,
        String password,
        EmployeeRole employeeRole,
        Long departmentId,
        Specialization specialization
) {}