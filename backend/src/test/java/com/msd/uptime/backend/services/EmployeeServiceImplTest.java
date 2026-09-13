package com.msd.uptime.backend.services;

import com.msd.uptime.backend.DTO.Employee.EmployeeLoginRequest;
import com.msd.uptime.backend.DTO.Employee.EmployeeLoginResponse;
import com.msd.uptime.backend.DTO.Employee.EmployeeRegisterRequest;
import com.msd.uptime.backend.models.Department;
import com.msd.uptime.backend.models.Employee;
import com.msd.uptime.backend.models.EmployeeRole;
import com.msd.uptime.backend.models.Specialization;
import com.msd.uptime.backend.repositories.DepartmentRepository;
import com.msd.uptime.backend.repositories.EmployeeRepository;
import com.msd.uptime.backend.support.TestDataFactory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class EmployeeServiceImplTest {

    @Mock
    private DepartmentRepository departmentRepository;

    @Mock
    private EmployeeRepository employeeRepository;

    @Mock
    private BCryptPasswordEncoder encoder;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private JWTService jwtService;

    private EmployeeServiceImpl employeeService;

    @BeforeEach
    void setUp() {
        employeeService = new EmployeeServiceImpl(encoder);
        ReflectionTestUtils.setField(employeeService, "departmentRepository", departmentRepository);
        ReflectionTestUtils.setField(employeeService, "employeeRepository", employeeRepository);
        ReflectionTestUtils.setField(employeeService, "authenticationManager", authenticationManager);
        ReflectionTestUtils.setField(employeeService, "jwtService", jwtService);
    }

    @Test
    void register_encodesPasswordAndKeepsSpecializationForWorkers() {
        Department department = TestDataFactory.department(1L, "Maintenance");
        EmployeeRegisterRequest request = new EmployeeRegisterRequest(
                "john", "john@test.com", "rawPass", EmployeeRole.SHIFT_WORKER, 1L, Specialization.MECHANICAL);

        when(departmentRepository.findDepartmentById(1L)).thenReturn(department);
        when(encoder.encode("rawPass")).thenReturn("encodedPass");
        when(employeeRepository.save(any(Employee.class))).thenAnswer(inv -> inv.getArgument(0));

        Employee saved = employeeService.register(request);

        assertThat(saved.getUsername()).isEqualTo("john");
        assertThat(saved.getEmail()).isEqualTo("john@test.com");
        assertThat(saved.getPassword()).isEqualTo("encodedPass");
        assertThat(saved.getEmployeeRole()).isEqualTo(EmployeeRole.SHIFT_WORKER);
        assertThat(saved.getDepartment()).isEqualTo(department);
        assertThat(saved.getSpecialization()).isEqualTo(Specialization.MECHANICAL);
        verify(employeeRepository).save(any(Employee.class));
    }

    @Test
    void register_clearsSpecializationForHead() {
        Department department = TestDataFactory.department(1L, "Maintenance");
        EmployeeRegisterRequest request = new EmployeeRegisterRequest(
                "boss", "boss@test.com", "rawPass", EmployeeRole.HEAD, 1L, Specialization.ELECTRICAL);

        when(departmentRepository.findDepartmentById(1L)).thenReturn(department);
        when(encoder.encode("rawPass")).thenReturn("encodedPass");
        when(employeeRepository.save(any(Employee.class))).thenAnswer(inv -> inv.getArgument(0));

        Employee saved = employeeService.register(request);

        assertThat(saved.getEmployeeRole()).isEqualTo(EmployeeRole.HEAD);
        assertThat(saved.getSpecialization()).isNull();
    }

    @Test
    void getUserById_returnsEmployeeWhenPresent() {
        Employee employee = TestDataFactory.employee(1L, "john", "john@test.com", EmployeeRole.GENERAL_WORKER, null, null);
        when(employeeRepository.findById(1L)).thenReturn(Optional.of(employee));

        assertThat(employeeService.getUserById(1L)).isEqualTo(employee);
    }

    @Test
    void getUserById_returnsNullWhenMissing() {
        when(employeeRepository.findById(99L)).thenReturn(Optional.empty());

        assertThat(employeeService.getUserById(99L)).isNull();
    }

    @Test
    void getAllUsers_returnsAllEmployees() {
        when(employeeRepository.findAll()).thenReturn(List.of(
                TestDataFactory.employee(1L, "john", "john@test.com", EmployeeRole.SHIFT_WORKER, null, null)));

        assertThat(employeeService.getAllUsers()).hasSize(1);
    }

    @Test
    void deleteUserById_delegatesToRepository() {
        employeeService.deleteUserById(7L);

        verify(employeeRepository).deleteById(7L);
    }

    @Test
    void authenticate_authenticatesAndReturnsLoginResponse() {
        Employee employee = TestDataFactory.employee(7L, "admin", "admin@test.com", EmployeeRole.HEAD, null, null);
        EmployeeLoginRequest request = new EmployeeLoginRequest("admin@test.com", "pass");

        when(employeeRepository.findByEmail("admin@test.com")).thenReturn(employee);
        when(jwtService.generateToken("admin@test.com")).thenReturn("jwt-token");

        EmployeeLoginResponse response = employeeService.authenticate(request);

        assertThat(response.jwtToken()).isEqualTo("jwt-token");
        assertThat(response.role()).isEqualTo("HEAD");
        assertThat(response.username()).isEqualTo("admin");
        assertThat(response.id()).isEqualTo(7L);
        verify(authenticationManager).authenticate(any(UsernamePasswordAuthenticationToken.class));
    }
}