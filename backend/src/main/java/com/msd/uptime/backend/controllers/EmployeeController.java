package com.msd.uptime.backend.controllers;

import com.msd.uptime.backend.DTO.Employee.EmployeeLoginRequest;
import com.msd.uptime.backend.DTO.Employee.EmployeeLoginResponse;
import com.msd.uptime.backend.DTO.Employee.EmployeeRegisterRequest;
import com.msd.uptime.backend.services.EmployeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import com.msd.uptime.backend.models.Employee;
import java.util.List;

@RestController
@RequestMapping("/uptime/api/v1/employee")
public class EmployeeController
{
    @Autowired
    private EmployeeService employeeService;

    @PreAuthorize("hasRole ('HEAD')")
    @PostMapping("/auth/register")
    public Employee registerUser(@RequestBody EmployeeRegisterRequest registerRequest){

        return employeeService.register(registerRequest);
    }

    @PostMapping("/auth/login")
    public EmployeeLoginResponse loginUser(@RequestBody EmployeeLoginRequest loginRequest){
        System.out.println("reached here");
        return employeeService.authenticate(loginRequest);
    }

    @GetMapping("{id}")
    public Employee getUser(@PathVariable Long id) {
        return employeeService.getUserById(id);
    }

    @PreAuthorize("hasRole ('HEAD')")
    @DeleteMapping("/{id}")
    public String deleteUser(@PathVariable Long id){
        employeeService.deleteUserById(id);
        return "User has been deleted";
    }

    @GetMapping()
    public List<Employee> getAllUsers() {
        return employeeService.getAllUsers();
    }
}
