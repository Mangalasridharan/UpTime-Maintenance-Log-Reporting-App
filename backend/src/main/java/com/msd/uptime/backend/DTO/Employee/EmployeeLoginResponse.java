package com.msd.uptime.backend.DTO.Employee;

public record EmployeeLoginResponse(
        String jwtToken,
        String role,
        String username,
        Long id
) {}