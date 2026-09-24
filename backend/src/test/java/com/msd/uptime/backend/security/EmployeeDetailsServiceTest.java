package com.msd.uptime.backend.security;

import com.msd.uptime.backend.models.Employee;
import com.msd.uptime.backend.models.EmployeeRole;
import com.msd.uptime.backend.repositories.EmployeeRepository;
import com.msd.uptime.backend.support.TestDataFactory;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class EmployeeDetailsServiceTest {

    @Mock
    private EmployeeRepository employeeRepository;

    @InjectMocks
    private EmployeeDetailsService employeeDetailsService;

    @Test
    void loadUserByUsername_returnsEmployeeDetails() {
        Employee employee = TestDataFactory.employee(
                1L, "jano", "jano@test.com", EmployeeRole.GENERAL_WORKER, null, null);
        when(employeeRepository.findByEmail("jano@test.com")).thenReturn(employee);

        UserDetails details = employeeDetailsService.loadUserByUsername("jano@test.com");

        assertThat(details.getUsername()).isEqualTo("jano@test.com");
        assertThat(details.getPassword()).isEqualTo(employee.getPassword());
        assertThat(details.getAuthorities())
                .extracting("authority")
                .containsExactly("ROLE_GENERAL_WORKER");
    }

    @Test
    void loadUserByUsername_throwsWhenEmployeeNotFound() {
        when(employeeRepository.findByEmail("ghost@test.com")).thenReturn(null);

        assertThatThrownBy(() -> employeeDetailsService.loadUserByUsername("ghost@test.com"))
                .isInstanceOf(UsernameNotFoundException.class)
                .hasMessageContaining("ghost@test.com");
    }
}