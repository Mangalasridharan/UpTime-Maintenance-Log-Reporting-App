package com.msd.uptime.backend.controllers;

import com.msd.uptime.backend.models.Department;
import com.msd.uptime.backend.response.ApiResponse;
import com.msd.uptime.backend.services.DepartmentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("uptime/api/v1/departments")
@Tag(name = "Department", description = "Department CRUD")
public class DepartmentController {

    @Autowired
    private DepartmentService departmentService;

    @PreAuthorize("hasRole ('HEAD')")
    @PostMapping()
    @Operation(summary = "Create a department (HEAD only)")
    public ResponseEntity<ApiResponse<Department>> createDepartment(@RequestBody Department department){
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Department created successfully", departmentService.createDepartment(department)));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get a department by ID")
    public ResponseEntity<ApiResponse<Department>> getDepartment(@PathVariable("id") Long id){
        return ResponseEntity.ok(ApiResponse.success("Department fetched successfully", departmentService.getDepartmentById(id)));
    }

    @GetMapping()
    @Operation(summary = "Get all departments")
    public ResponseEntity<ApiResponse<List<Department>>> getAllDepartments(){
        return ResponseEntity.ok(ApiResponse.success("Departments fetched successfully", departmentService.getAllDepartments()));
    }

    @PreAuthorize("hasRole ('HEAD')")
    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a department (HEAD only)")
    public ResponseEntity<ApiResponse<Void>> deleteDepartment(@PathVariable("id") Long id){
        departmentService.deleteDepartmentById(id);
        return ResponseEntity.ok(ApiResponse.<Void>success("Department deleted successfully", null));
    }

}