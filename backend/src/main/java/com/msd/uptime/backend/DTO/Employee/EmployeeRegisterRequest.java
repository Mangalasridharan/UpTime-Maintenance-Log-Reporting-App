package com.msd.uptime.backend.DTO.Employee;

import com.msd.uptime.backend.models.EmployeeRole;
import com.msd.uptime.backend.models.Specialization;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record EmployeeRegisterRequest(
        @NotBlank(message = "Username is required")
        @Size(min = 3, max = 25, message = "Username must be between 3 and 25 characters")
        String username,
        @NotBlank(message = "Email is required")
        @Email(message = "Email must be valid")
        String email,
        @NotBlank(message = "Password is required")
        @Pattern(regexp = "^(?=.*[A-Z])(?=.*\\d).+$", message = "Password must contain at least one uppercase letter and one digit")
        String password,
        @NotNull(message = "Employee role is required")
        EmployeeRole employeeRole,
        @NotNull(message = "Department is required")
        Long departmentId,
        Specialization specialization
) {}