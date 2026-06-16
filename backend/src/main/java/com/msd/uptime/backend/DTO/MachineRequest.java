package com.msd.uptime.backend.DTO;

import com.msd.uptime.backend.models.MachineStatus;
import lombok.Data;

@Data
public class MachineRequest {
    private String name;
    private Long departmentId;
}
