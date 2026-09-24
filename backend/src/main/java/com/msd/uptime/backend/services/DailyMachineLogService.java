package com.msd.uptime.backend.services;

import com.msd.uptime.backend.models.DailyLogTimeOfDay;
import com.msd.uptime.backend.models.DailyMachineLog;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.List;

public interface DailyMachineLogService {
    DailyMachineLog uploadPhoto(Long machineId, Long employeeId, LocalDate logDate, DailyLogTimeOfDay timeOfDay, MultipartFile file);
    List<DailyMachineLog> getLogsForDate(Long machineId, LocalDate logDate);
}