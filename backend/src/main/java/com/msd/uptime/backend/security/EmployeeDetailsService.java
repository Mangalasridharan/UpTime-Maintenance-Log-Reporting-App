package com.msd.uptime.backend.security;

import com.msd.uptime.backend.models.Employee;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import com.msd.uptime.backend.repositories.EmployeeRepository;

@Service
public class EmployeeDetailsService implements UserDetailsService {

    private final EmployeeRepository employeeRepository;

    public EmployeeDetailsService(EmployeeRepository employeeRepository) {
        this.employeeRepository = employeeRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Employee employee =
                employeeRepository.findByEmail(email);

        if(employee == null){
            throw new UsernameNotFoundException("Employee not found with email"+email);
        }
        return new EmployeeDetails(employee);
    }
}