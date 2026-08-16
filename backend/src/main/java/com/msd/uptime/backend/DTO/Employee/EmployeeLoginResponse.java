package com.msd.uptime.backend.DTO.Employee;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class EmployeeLoginResponse {
    private String jwtToken;
    private String role;
    private String username;
    private Long id;
}
