package com.msd.uptime.backend.DTO.Employee;

import com.msd.uptime.backend.models.EmployeeRole;
import com.msd.uptime.backend.models.Specialization;
import lombok.Data;

@Data
public class EmployeeRegisterRequest {
    private String username;
    private String email;
    private String password;
    private EmployeeRole employeeRole;
    private Long departmentId;
    private Specialization specialization;
}
