package com.msd.uptime.backend.events;

import com.msd.uptime.backend.models.NotificationType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class NotificationEvent implements Serializable {

    private Long recipientId;

    private String title;

    private String message;

    private NotificationType notificationType = NotificationType.IN_APP;
}