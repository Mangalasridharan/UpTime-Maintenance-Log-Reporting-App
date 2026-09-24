package com.msd.uptime.backend.repositories;

import com.msd.uptime.backend.models.DailyLogTimeOfDay;
import com.msd.uptime.backend.models.DailyMachineLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface DailyMachineLogRepository extends JpaRepository<DailyMachineLog, Long> {
    Optional<DailyMachineLog> findByMachineIdAndLogDateAndTimeOfDay(Long machineId, LocalDate date, DailyLogTimeOfDay timeOfDay);
    List<DailyMachineLog> findByMachineIdOrderByLogDateDescCreatedAtDesc(Long machineId);
}