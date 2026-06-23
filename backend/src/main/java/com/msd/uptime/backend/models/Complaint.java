package com.msd.uptime.backend.models;

import jakarta.persistence.*;

import javax.crypto.Mac;
import java.time.LocalDateTime;

@Entity(name="complaints")
public class Complaint {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name="description", nullable=false)
    private String description;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "machine_id", nullable=false)
    private Machine machine;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="reported_by", nullable=false)
    private Employee reportedBy;

    @Enumerated(EnumType.STRING)
    @Column(name = "complaint_status", nullable=false)
    private ComplaintStatus status;

    private LocalDateTime reportedAt;

    private LocalDateTime assignedAt;

    private LocalDateTime resolvedAt;
}
