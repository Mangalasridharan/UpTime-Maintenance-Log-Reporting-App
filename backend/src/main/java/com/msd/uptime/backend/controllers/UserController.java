package com.msd.uptime.backend.controllers;

import com.msd.uptime.backend.services.EmployeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.msd.uptime.backend.models.Employee;

import java.util.List;

@RestController
@RequestMapping("/uptime/api/v1/users")
public class UserController
{
    @Autowired
    private EmployeeService employeeService;

    @PostMapping("/auth/register")
    public Employee registerUser(@RequestBody Employee employee){
        return employeeService.register(employee);
    }

    @PostMapping("/auth/login")
    public String loginUser(@RequestParam String email, @RequestParam String password){
        return employeeService.authenticate(email, password);
    }

    @GetMapping("{id}")
    public Employee getUser(@PathVariable Long id)
    {
        return employeeService.getUserById(id);
    }

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
