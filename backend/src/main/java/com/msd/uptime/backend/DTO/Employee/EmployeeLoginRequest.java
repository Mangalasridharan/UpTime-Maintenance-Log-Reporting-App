package com.msd.uptime.backend.DTO.Employee;

public record EmployeeLoginRequest(
        String email,
        String password
) {}