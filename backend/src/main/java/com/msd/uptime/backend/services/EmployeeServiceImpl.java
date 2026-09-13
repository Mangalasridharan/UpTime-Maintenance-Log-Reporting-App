package com.msd.uptime.backend.services;

import com.msd.uptime.backend.DTO.Employee.EmployeeLoginRequest;
import com.msd.uptime.backend.DTO.Employee.EmployeeLoginResponse;
import com.msd.uptime.backend.DTO.Employee.EmployeeRegisterRequest;
import com.msd.uptime.backend.models.Department;
import com.msd.uptime.backend.models.Employee;
import com.msd.uptime.backend.models.EmployeeRole;
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

    public Employee register(EmployeeRegisterRequest employeeRegisterRequest){
        Department department = departmentRepository.findDepartmentById(employeeRegisterRequest.departmentId());
        System.out.println(department);
        Employee employee = new Employee();
        employee.setUsername(employeeRegisterRequest.username());
        employee.setEmail(employeeRegisterRequest.email());
        employee.setPassword(encoder.encode(employeeRegisterRequest.password()));
        employee.setEmployeeRole(employeeRegisterRequest.employeeRole());
        employee.setDepartment(department);

        if(employee.getEmployeeRole()==EmployeeRole.HEAD || employee.getEmployeeRole()==EmployeeRole.HOD){
            employee.setSpecialization(null);
        }
        else{
            employee.setSpecialization(employeeRegisterRequest.specialization());
        }

        return  employeeRepository.save(employee);
    }

    public EmployeeLoginResponse authenticate(EmployeeLoginRequest loginRequest){

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.email(),
                        loginRequest.password()
                )
        );

        Employee employee = employeeRepository.findByEmail(
                loginRequest.email()
        );

        return new EmployeeLoginResponse(
                jwtService.generateToken(employee.getEmail()),
                employee.getEmployeeRole().name(),
                employee.getUsername(),
                employee.getId()
        );
    }

}
