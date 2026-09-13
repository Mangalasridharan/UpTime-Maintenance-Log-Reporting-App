package com.msd.uptime.backend.controllers;

import com.msd.uptime.backend.DTO.Employee.EmployeeLoginRequest;
import com.msd.uptime.backend.DTO.Employee.EmployeeLoginResponse;
import com.msd.uptime.backend.DTO.Employee.EmployeeRegisterRequest;
import com.msd.uptime.backend.models.Employee;
import com.msd.uptime.backend.models.EmployeeRole;
import com.msd.uptime.backend.services.EmployeeService;
import com.msd.uptime.backend.support.TestDataFactory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
class EmployeeControllerTest {

    @Mock
    private EmployeeService employeeService;

    @InjectMocks
    private EmployeeController employeeController;

    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(employeeController).build();
    }

    @Test
    void registerUser_delegatesToService() throws Exception {
        Employee employee = TestDataFactory.employee(
                1L, "jano", "jano@test.com", EmployeeRole.HEAD, null, null);
        when(employeeService.register(any(EmployeeRegisterRequest.class))).thenReturn(employee);

        mockMvc.perform(post("/uptime/api/v1/employee/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"username":"jano","email":"jano@test.com","password":"Pass1","employeeRole":"HEAD","departmentId":1}
                                """))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.username").value("jano"))
                .andExpect(jsonPath("$.data.email").value("jano@test.com"));
    }

    @Test
    void loginUser_delegatesToService() throws Exception {
        when(employeeService.authenticate(any(EmployeeLoginRequest.class)))
                .thenReturn(new EmployeeLoginResponse("jwt-123", "HEAD", "jano", 1L));

        mockMvc.perform(post("/uptime/api/v1/employee/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"email":"jano@test.com","password":"pass"}
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.jwtToken").value("jwt-123"))
                .andExpect(jsonPath("$.data.role").value("HEAD"));
    }

    @Test
    void getUser_delegatesToService() throws Exception {
        when(employeeService.getUserById(1L))
                .thenReturn(TestDataFactory.employee(
                        1L, "jano", "jano@test.com", EmployeeRole.HEAD, null, null));

        mockMvc.perform(get("/uptime/api/v1/employee/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.email").value("jano@test.com"));
    }

    @Test
    void getAllUsers_returnsList() throws Exception {
        when(employeeService.getAllUsers()).thenReturn(List.of(
                TestDataFactory.employee(
                        1L, "jano", "jano@test.com", EmployeeRole.HEAD, null, null)));

        mockMvc.perform(get("/uptime/api/v1/employee"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.length()").value(1));
    }

    @Test
    void deleteUser_delegatesAndReturnsMessage() throws Exception {
        mockMvc.perform(delete("/uptime/api/v1/employee/4"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("User has been deleted"));

        verify(employeeService).deleteUserById(4L);
    }
}