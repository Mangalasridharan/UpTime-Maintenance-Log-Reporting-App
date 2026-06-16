package com.msd.uptime.backend.models;

import jakarta.persistence.*;
import com.msd.uptime.backend.models.MachineStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name="machines")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Machine {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name="machine_name", nullable = false)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(name="machine_status", nullable = false)
    private MachineStatus status = MachineStatus.IDLE;

    @ManyToOne(fetch=FetchType.LAZY)
    @JoinColumn(name = "department_id")
    private Department department;
}
