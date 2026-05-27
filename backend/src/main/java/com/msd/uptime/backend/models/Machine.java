package com.msd.uptime.backend.models;

import jakarta.persistence.*;
import com.msd.uptime.backend.models.MachineStatus;

@Entity
@Table(name="machines")
public class Machine {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name="machine_name", nullable = false)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(name="machine_status", nullable = false)
    private MachineStatus status;

    @ManyToOne(fetch=FetchType.LAZY)
    @JoinColumn(name = "department_id")
    private Department department;

    public Machine() {}

    public Machine(String name, MachineStatus status, Department department) {
        this.name = name;
        this.status = status;
        this.department = department;
    }

    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
    public MachineStatus getStatus() {
        return status;
    }
    public void setStatus(MachineStatus status) {
        this.status = status;
    }
    public Department getDepartment() {
        return department;
    }
    public void setDepartment(Department department) {
        this.department = department;
    }
}
