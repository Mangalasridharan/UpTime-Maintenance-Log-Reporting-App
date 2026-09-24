package com.msd.uptime.backend.repositories;

import com.msd.uptime.backend.models.Complaint;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ComplaintRepository extends JpaRepository<Complaint,Long> {
    List<Complaint> findByMachineIdOrderByReportedAtDesc(Long machineId);
}
