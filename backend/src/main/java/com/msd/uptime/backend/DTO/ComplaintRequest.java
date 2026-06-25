package com.msd.uptime.backend.DTO;

import lombok.Data;

@Data
public class ComplaintRequest {
    private String description;
    private Long machineId;
    private Long employeeId;
}
