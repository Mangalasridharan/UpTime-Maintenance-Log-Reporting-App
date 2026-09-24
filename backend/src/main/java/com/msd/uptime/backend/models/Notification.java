package com.msd.uptime.backend.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name="Notifications")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name="recipient_id", nullable=false)
    private Employee recipient;

    private String title;
    private String message;

    @Enumerated(EnumType.STRING)
    @Column(name="notification_type", nullable=false,
            columnDefinition = "varchar(255) not null default 'IN_APP'")
    private NotificationType notificationType = NotificationType.IN_APP;

    private boolean read = false;
    private LocalDateTime createdAt;
}