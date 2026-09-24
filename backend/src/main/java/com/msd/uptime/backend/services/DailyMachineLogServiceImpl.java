package com.msd.uptime.backend.services;

import com.msd.uptime.backend.models.DailyLogTimeOfDay;
import com.msd.uptime.backend.models.DailyMachineLog;
import com.msd.uptime.backend.models.Employee;
import com.msd.uptime.backend.models.Machine;
import com.msd.uptime.backend.repositories.DailyMachineLogRepository;
import com.msd.uptime.backend.repositories.EmployeeRepository;
import com.msd.uptime.backend.repositories.MachineRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class DailyMachineLogServiceImpl implements DailyMachineLogService {

    private static final String UPLOAD_DIR = "uploads/daily-logs";
    private static final DateTimeFormatter DATE_FORMAT = DateTimeFormatter.ofPattern("yyyy-MM-dd");

    @Autowired
    private DailyMachineLogRepository dailyMachineLogRepository;

    @Autowired
    private MachineRepository machineRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    @Override
    public DailyMachineLog uploadPhoto(Long machineId, Long employeeId, LocalDate logDate, DailyLogTimeOfDay timeOfDay, MultipartFile file) {
        Machine machine = machineRepository.findById(machineId)
                .orElseThrow(() -> new IllegalArgumentException("Machine not found with id: " + machineId));
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new IllegalArgumentException("Employee not found with id: " + employeeId));

        String savedPath = storePhoto(machineId, logDate, timeOfDay, file);

        Optional<DailyMachineLog> existing =
                dailyMachineLogRepository.findByMachineIdAndLogDateAndTimeOfDay(machineId, logDate, timeOfDay);

        DailyMachineLog log = existing.orElseGet(DailyMachineLog::new);
        log.setMachine(machine);
        log.setLoggedBy(employee);
        log.setLogDate(logDate);
        log.setTimeOfDay(timeOfDay);
        log.setPhotoPath(savedPath);
        return dailyMachineLogRepository.save(log);
    }

    @Override
    public List<DailyMachineLog> getLogsForDate(Long machineId, LocalDate logDate) {
        return dailyMachineLogRepository.findByMachineIdOrderByLogDateDescCreatedAtDesc(machineId).stream()
                .filter(log -> log.getLogDate().equals(logDate))
                .toList();
    }

    private String storePhoto(Long machineId, LocalDate logDate, DailyLogTimeOfDay timeOfDay, MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Photo file must not be empty");
        }
        String original = Optional.ofNullable(file.getOriginalFilename()).orElse("photo.jpg");
        String extension = original.contains(".")
                ? original.substring(original.lastIndexOf('.'))
                : ".jpg";
        String fileName = "machine-" + machineId
                + "-" + logDate.format(DATE_FORMAT)
                + "-" + timeOfDay.name().toLowerCase()
                + "-" + UUID.randomUUID()
                + extension;

        try {
            Path dir = Paths.get(UPLOAD_DIR, String.valueOf(machineId));
            Files.createDirectories(dir);
            Path target = dir.resolve(fileName);
            file.transferTo(target.toAbsolutePath());
            return "/uploads/daily-logs/" + machineId + "/" + fileName;
        } catch (IOException e) {
            throw new IllegalStateException("Failed to store uploaded photo", e);
        }
    }
}