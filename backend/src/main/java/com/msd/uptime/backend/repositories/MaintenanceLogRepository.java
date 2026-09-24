package com.msd.uptime.backend.repositories;

import com.msd.uptime.backend.models.MaintenanceLogs;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface MaintenanceLogRepository extends JpaRepository<MaintenanceLogs, Long> {
    Optional<MaintenanceLogs> findByComplaintId(Long complaintId);
    List<MaintenanceLogs> findByMachineIdOrderByReportedAtDesc(Long machineId);
}
