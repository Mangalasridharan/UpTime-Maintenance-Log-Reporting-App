package com.msd.uptime.backend.services;

import com.msd.uptime.backend.models.Department;
import com.msd.uptime.backend.repositories.DepartmentRepository;
import com.msd.uptime.backend.support.TestDataFactory;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class DepartmentServiceImplTest {

    @Mock
    private DepartmentRepository departmentRepository;

    @InjectMocks
    private DepartmentServiceImpl departmentService;

    @Test
    void createDepartment_savesAndReturnsDepartment() {
        Department request = new Department("Mechanical");
        Department saved = TestDataFactory.department(1L, "Mechanical");
        when(departmentRepository.save(request)).thenReturn(saved);

        Department result = departmentService.createDepartment(request);

        assertThat(result.getId()).isEqualTo(1L);
        assertThat(result.getName()).isEqualTo("Mechanical");
        verify(departmentRepository).save(request);
    }

    @Test
    void getDepartmentById_returnsDepartmentWhenPresent() {
        Department department = TestDataFactory.department(1L, "Mechanical");
        when(departmentRepository.findById(1L)).thenReturn(Optional.of(department));

        assertThat(departmentService.getDepartmentById(1L)).isEqualTo(department);
    }

    @Test
    void getDepartmentById_returnsNullWhenMissing() {
        when(departmentRepository.findById(99L)).thenReturn(Optional.empty());

        assertThat(departmentService.getDepartmentById(99L)).isNull();
    }

    @Test
    void getAllDepartments_returnsAllDepartments() {
        when(departmentRepository.findAll()).thenReturn(List.of(
                TestDataFactory.department(1L, "Mechanical"),
                TestDataFactory.department(2L, "Electrical")));

        assertThat(departmentService.getAllDepartments())
                .extracting(Department::getName)
                .containsExactly("Mechanical", "Electrical");
    }

    @Test
    void deleteDepartmentById_delegatesToRepository() {
        departmentService.deleteDepartmentById(7L);

        verify(departmentRepository).deleteById(7L);
    }
}