package com.msd.uptime.backend.DTO;

import com.msd.uptime.backend.models.Department;
import com.msd.uptime.backend.models.EmployeeRole;
import lombok.Data;

@Data
public class EmployeeRequest {
    private String username;
    private String email;
    private String password;
    private EmployeeRole employeeRole;
    private Long departmentId;
}
