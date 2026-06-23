package com.msd.uptime.backend.DTO.Employee;

import lombok.Data;

@Data
public class EmployeeLoginRequest {
    private String email;
    private String password;
}
