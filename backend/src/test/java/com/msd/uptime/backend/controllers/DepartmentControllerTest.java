package com.msd.uptime.backend.controllers;

import com.msd.uptime.backend.models.Department;
import com.msd.uptime.backend.services.DepartmentService;
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
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
class DepartmentControllerTest {

    @Mock
    private DepartmentService departmentService;

    @InjectMocks
    private DepartmentController departmentController;

    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(departmentController).build();
    }

    @Test
    void createDepartment_delegatesToService() throws Exception {
        Department saved = TestDataFactory.department(1L, "Mechanical");
        when(departmentService.createDepartment(any(Department.class))).thenReturn(saved);

        mockMvc.perform(post("/uptime/api/v1/departments")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"name\":\"Mechanical\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.name").value("Mechanical"));
    }

    @Test
    void getDepartment_delegatesToService() throws Exception {
        when(departmentService.getDepartmentById(1L))
                .thenReturn(TestDataFactory.department(1L, "Mechanical"));

        mockMvc.perform(get("/uptime/api/v1/departments/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Mechanical"));
    }

    @Test
    void getAllDepartments_returnsList() throws Exception {
        when(departmentService.getAllDepartments()).thenReturn(List.of(
                TestDataFactory.department(1L, "Mechanical"),
                TestDataFactory.department(2L, "Electrical")));

        mockMvc.perform(get("/uptime/api/v1/departments"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2));
    }

    @Test
    void deleteDepartment_delegatesAndReturnsMessage() throws Exception {
        mockMvc.perform(delete("/uptime/api/v1/departments/3"))
                .andExpect(status().isOk())
                .andExpect(content().string("Department deleted successfully"));

        verify(departmentService).deleteDepartmentById(anyLong());
    }
}