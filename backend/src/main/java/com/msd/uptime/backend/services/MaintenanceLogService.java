package com.msd.uptime.backend.services;

import com.msd.uptime.backend.models.MaintenanceLogs;
import com.msd.uptime.backend.models.WorkType;

import java.util.List;

public interface MaintenanceLogService {
    List<MaintenanceLogs> getAllMaintenanceLogs();
    MaintenanceLogs getMaintenanceLogById(Long id);
    MaintenanceLogs createMaintenanceLog(MaintenanceLogs log);
    MaintenanceLogs switchWorkType(Long logId, WorkType newWorkType);
    MaintenanceLogs getMaintenanceLogByComplaintId(Long complaintId);
}
