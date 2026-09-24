package com.msd.uptime.backend.services;

import com.msd.uptime.backend.models.MaintenanceLogs;
import com.msd.uptime.backend.models.WorkType;
import com.msd.uptime.backend.repositories.MaintenanceLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MaintenanceLogServiceImpl implements MaintenanceLogService {

    @Autowired
    private MaintenanceLogRepository maintenanceLogRepository;

    @Override
    public List<MaintenanceLogs> getAllMaintenanceLogs() {
        return maintenanceLogRepository.findAll();
    }

    @Override
    public MaintenanceLogs getMaintenanceLogById(Long id) {
        return maintenanceLogRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Maintenance log not found with id: " + id));
    }

    @Override
    public MaintenanceLogs createMaintenanceLog(MaintenanceLogs log) {
        return maintenanceLogRepository.save(log);
    }

    @Override
    public MaintenanceLogs switchWorkType(Long logId, WorkType newWorkType) {
        MaintenanceLogs log = getMaintenanceLogById(logId);
        log.setWorkType(newWorkType);
        return maintenanceLogRepository.save(log);
    }

    @Override
    public MaintenanceLogs getMaintenanceLogByComplaintId(Long complaintId) {
        return maintenanceLogRepository.findByComplaintId(complaintId)
                .orElseThrow(() -> new RuntimeException("No maintenance log found for complaint id: " + complaintId));
    }
}
