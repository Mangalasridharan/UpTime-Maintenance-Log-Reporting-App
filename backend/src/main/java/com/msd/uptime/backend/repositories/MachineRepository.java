package com.msd.uptime.backend.repositories;

import com.msd.uptime.backend.models.Machine;
import com.msd.uptime.backend.models.MachineStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface MachineRepository extends JpaRepository<Machine,Long> {
    Long countByStatus(MachineStatus status);
}
