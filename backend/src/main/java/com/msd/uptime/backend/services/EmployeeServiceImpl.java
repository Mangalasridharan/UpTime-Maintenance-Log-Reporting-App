package com.msd.uptime.backend.services;

import com.msd.uptime.backend.DTO.EmployeeRequest;
import com.msd.uptime.backend.models.Department;
import com.msd.uptime.backend.models.Employee;
import com.msd.uptime.backend.repositories.DepartmentRepository;
import com.msd.uptime.backend.repositories.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EmployeeServiceImpl implements EmployeeService {

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    private BCryptPasswordEncoder encoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JWTService jwtService;

    public EmployeeServiceImpl(BCryptPasswordEncoder passwordEncoder){
        this.encoder = passwordEncoder;
    }

    public Employee getUserById(Long id) {
        return employeeRepository.findById(id).orElse(null);
    }

    public List<Employee> getAllUsers() {

        return employeeRepository.findAll();
    }

    public void  deleteUserById(Long id) {
        employeeRepository.deleteById(id);
    }

    public Employee register(EmployeeRequest employeeRequest){
        Department department = departmentRepository.findDepartmentById(employeeRequest.getDepartmentId());

        Employee employee = new Employee();
        employee.setUsername(employeeRequest.getUsername());
        employee.setEmail(employeeRequest.getEmail());
        employee.setPassword(encoder.encode(employeeRequest.getPassword()));
        employee.setEmployeeRole(employeeRequest.getEmployeeRole());
        employee.setDepartment(department);

        return  employeeRepository.save(employee);
    }

    public String authenticate(String email, String password){
        Employee employee = employeeRepository.findByEmail(email);
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, password)
        );

        if(authentication.isAuthenticated()) {
            SecurityContextHolder.getContext().setAuthentication(authentication);
            System.out.println(jwtService.generateToken(employee.getEmail()));
            return jwtService.generateToken(employee.getEmail());
        }
        return "";
    }

}
