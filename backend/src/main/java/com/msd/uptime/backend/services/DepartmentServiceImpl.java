package com.msd.uptime.backend.services;
import com.msd.uptime.backend.repositories.DepartmentRepository;
import com.msd.uptime.backend.services.DepartmentService;
import com.msd.uptime.backend.models.Department;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class DepartmentServiceImpl implements DepartmentService{

    @Autowired
    private DepartmentRepository departmentRepository;

    public Department createDepartment(Department department){
        return departmentRepository.save(department);
    }

    public Department getDepartmentById(Long id) {
        return departmentRepository.findById(id).orElse(null);
    }

    public List<Department> getAllDepartments(){
        return departmentRepository.findAll();
    }

    public void deleteDepartmentById(Long id){
        departmentRepository.deleteById(id);
    }
}
