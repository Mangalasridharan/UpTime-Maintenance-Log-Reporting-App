package com.msd.uptime.backend.DTO;

import com.msd.uptime.backend.models.NotificationType;

import java.time.LocalDateTime;

public record NotificationResponse(
        Long id,
        String title,
        String message,
        NotificationType notificationType,
        Long recipientId,
        boolean read,
        LocalDateTime createdAt
){}