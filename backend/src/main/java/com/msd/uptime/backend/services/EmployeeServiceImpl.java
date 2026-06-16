package com.msd.uptime.backend.services;

import com.msd.uptime.backend.models.Employee;
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
public class EmployeeServiceImpl implements EmployeeService
{
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

//    public User createUser(User user)
//    {
//        return userRepository.save(user);
//    }

    public Employee getUserById(Long id) {
        return employeeRepository.findById(id).orElse(null);
    }

    public List<Employee> getAllUsers() {

        return employeeRepository.findAll();
    }

    public void  deleteUserById(Long id) {
        employeeRepository.deleteById(id);
    }

    public Employee register(Employee employee){
        employee.setPassword(encoder.encode(employee.getPassword()));
        System.out.println("The password is "+ employee.getPassword());
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
