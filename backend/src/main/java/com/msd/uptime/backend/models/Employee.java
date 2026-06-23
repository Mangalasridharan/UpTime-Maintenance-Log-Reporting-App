package com.msd.uptime.backend.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Entity
@Table(name="Users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Employee
{
    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    @Column(name="id")
    private Long id;

    @Column(name="name", nullable=false)
    private String username;

    @Column(name="email", nullable=false, unique=true)
    private String email;

    @Column(name="password", nullable=false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(name="role", nullable=false)
    private EmployeeRole employeeRole;

    @ManyToOne(fetch=FetchType.LAZY)
    @JoinColumn(name="department_id")
    private Department department;

    @CreationTimestamp
    @Column(name="created_at", nullable=false)
    private LocalDateTime createdAt;

    @Enumerated(EnumType.STRING)
    @Column(name="specialization")
    private Specialization specialization;
}
