package com.msd.uptime.backend.controllers;

import com.msd.uptime.backend.DTO.Employee.EmployeeLoginRequest;
import com.msd.uptime.backend.DTO.Employee.EmployeeLoginResponse;
import com.msd.uptime.backend.DTO.Employee.EmployeeRegisterRequest;
import com.msd.uptime.backend.models.Employee;
import com.msd.uptime.backend.response.ApiResponse;
import com.msd.uptime.backend.services.EmployeeService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/uptime/api/v1/employee")
public class EmployeeController
{
    @Autowired
    private EmployeeService employeeService;

    @PreAuthorize("hasRole ('HEAD')")
    @PostMapping("/auth/register")
    public ResponseEntity<ApiResponse<Employee>> registerUser(@Valid @RequestBody EmployeeRegisterRequest registerRequest){
        Employee employee = employeeService.register(registerRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("User registered successfully", employee));
    }

    @PostMapping("/auth/login")
    public ResponseEntity<ApiResponse<EmployeeLoginResponse>> loginUser(@Valid @RequestBody EmployeeLoginRequest loginRequest){
        EmployeeLoginResponse response = employeeService.authenticate(loginRequest);
        return ResponseEntity.ok(ApiResponse.success("Login successful", response));
    }

    @GetMapping("{id}")
    public ResponseEntity<ApiResponse<Employee>> getUser(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("User fetched successfully", employeeService.getUserById(id)));
    }

    @PreAuthorize("hasRole ('HEAD')")
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteUser(@PathVariable Long id){
        employeeService.deleteUserById(id);
        return ResponseEntity.ok(ApiResponse.<Void>success("User has been deleted", null));
    }

    @GetMapping()
    public ResponseEntity<ApiResponse<List<Employee>>> getAllUsers() {
        return ResponseEntity.ok(ApiResponse.success("Users fetched successfully", employeeService.getAllUsers()));
    }
}