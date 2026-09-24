package com.msd.uptime.backend.security;

import com.msd.uptime.backend.models.Employee;
import com.msd.uptime.backend.models.EmployeeRole;
import com.msd.uptime.backend.support.TestDataFactory;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class EmployeeDetailsTest {

    @Test
    void mapsEmployeeToUserDetails() {
        Employee employee = TestDataFactory.employee(
                1L, "jano", "jano@test.com", EmployeeRole.HOD, null, null);
        EmployeeDetails details = new EmployeeDetails(employee);

        assertThat(details.getUsername()).isEqualTo("jano@test.com");
        assertThat(details.getPassword()).isEqualTo(employee.getPassword());
        assertThat(details.getAuthorities())
                .extracting("authority")
                .containsExactly("ROLE_HOD");
        assertThat(details.isAccountNonExpired()).isTrue();
        assertThat(details.isAccountNonLocked()).isTrue();
        assertThat(details.isCredentialsNonExpired()).isTrue();
        assertThat(details.isEnabled()).isTrue();
    }
}