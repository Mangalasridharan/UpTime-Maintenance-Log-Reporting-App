package com.msd.uptime.backend.services;

import com.msd.uptime.backend.models.Department;

import java.util.List;

public interface DepartmentService{
    Department createDepartment(Department department);
    Department getDepartmentById(Long id);
    List<Department> getAllDepartments();
    void deleteDepartmentById(Long id);
}
