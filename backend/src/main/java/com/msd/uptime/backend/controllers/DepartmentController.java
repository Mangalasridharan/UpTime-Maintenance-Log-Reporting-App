package com.msd.uptime.backend.controllers;

import com.msd.uptime.backend.services.DepartmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import com.msd.uptime.backend.models.Department;

import java.util.List;

@RestController
@RequestMapping("uptime/api/v1/departments")
public class DepartmentController {

    @Autowired
    private DepartmentService departmentService;

    @PreAuthorize("hasRole ('HEAD')")
    @PostMapping()
    public Department createDepartment(@RequestBody Department department){
        return departmentService.createDepartment(department);
    }

    @GetMapping("/{id}")
    public Department getDepartment(@PathVariable("id") Long id){
        return departmentService.getDepartmentById(id);
    }

    @GetMapping()
    public List<Department> getAllDepartments(){
        return departmentService.getAllDepartments();
    }

    @PreAuthorize("hasRole ('HEAD')")
    @DeleteMapping("/{id}")
    public String deleteDepartment(@PathVariable("id") Long id){
        departmentService.deleteDepartmentById(id);
        return "Department deleted successfully";
    }

}
