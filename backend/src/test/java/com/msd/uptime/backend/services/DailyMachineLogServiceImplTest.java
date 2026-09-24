package com.msd.uptime.backend.services;

import com.msd.uptime.backend.models.DailyLogTimeOfDay;
import com.msd.uptime.backend.models.DailyMachineLog;
import com.msd.uptime.backend.models.Department;
import com.msd.uptime.backend.models.Employee;
import com.msd.uptime.backend.models.EmployeeRole;
import com.msd.uptime.backend.models.Machine;
import com.msd.uptime.backend.models.MachineStatus;
import com.msd.uptime.backend.models.Specialization;
import com.msd.uptime.backend.repositories.DailyMachineLogRepository;
import com.msd.uptime.backend.repositories.EmployeeRepository;
import com.msd.uptime.backend.repositories.MachineRepository;
import com.msd.uptime.backend.support.TestDataFactory;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Path;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class DailyMachineLogServiceImplTest {

    @Mock
    private DailyMachineLogRepository dailyMachineLogRepository;

    @Mock
    private MachineRepository machineRepository;

    @Mock
    private EmployeeRepository employeeRepository;

    @InjectMocks
    private DailyMachineLogServiceImpl dailyMachineLogService;

    @Test
    void uploadPhoto_createsLogWhenSlotEmpty() throws Exception {
        Department department = TestDataFactory.department(1L, "Mechanical");
        Machine machine = TestDataFactory.machine(1L, "Lathe", MachineStatus.RUNNING, department);
        Employee employee = TestDataFactory.employee(5L, "ram", "ram@test.com",
                EmployeeRole.SHIFT_WORKER, department, Specialization.MECHANICAL);
        LocalDate date = LocalDate.of(2026, 9, 16);
        MultipartFile photo = mock(MultipartFile.class);
        when(photo.isEmpty()).thenReturn(false);
        when(photo.getOriginalFilename()).thenReturn("morning.jpg");
        doNothing().when(photo).transferTo(any(Path.class));

        when(machineRepository.findById(1L)).thenReturn(Optional.of(machine));
        when(employeeRepository.findById(5L)).thenReturn(Optional.of(employee));
        when(dailyMachineLogRepository.findByMachineIdAndLogDateAndTimeOfDay(
                anyLong(), eq(date), eq(DailyLogTimeOfDay.MORNING))).thenReturn(Optional.empty());
        when(dailyMachineLogRepository.save(any(DailyMachineLog.class))).thenAnswer(inv -> inv.getArgument(0));

        DailyMachineLog saved = dailyMachineLogService.uploadPhoto(1L, 5L, date, DailyLogTimeOfDay.MORNING, photo);

        assertThat(saved.getMachine()).isEqualTo(machine);
        assertThat(saved.getLoggedBy()).isEqualTo(employee);
        assertThat(saved.getLogDate()).isEqualTo(date);
        assertThat(saved.getTimeOfDay()).isEqualTo(DailyLogTimeOfDay.MORNING);
        assertThat(saved.getPhotoPath()).startsWith("/uploads/daily-logs/");
    }

    @Test
    void getLogsForDate_filtersByIdenticalDate() {
        DailyMachineLog morning = new DailyMachineLog();
        morning.setId(1L);
        morning.setLogDate(LocalDate.of(2026, 9, 16));
        morning.setTimeOfDay(DailyLogTimeOfDay.MORNING);
        DailyMachineLog otherDay = new DailyMachineLog();
        otherDay.setId(2L);
        otherDay.setLogDate(LocalDate.of(2026, 9, 15));
        otherDay.setTimeOfDay(DailyLogTimeOfDay.EVENING);

        when(dailyMachineLogRepository.findByMachineIdOrderByLogDateDescCreatedAtDesc(1L))
                .thenReturn(List.of(morning, otherDay));

        List<DailyMachineLog> logs = dailyMachineLogService.getLogsForDate(1L, LocalDate.of(2026, 9, 16));

        assertThat(logs).extracting(DailyMachineLog::getId).containsExactly(1L);
    }
}