package com.msd.uptime.backend.events;

import com.msd.uptime.backend.models.Employee;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;

@Getter
@AllArgsConstructor
public class NotificationEvent {
    private final Employee recipient;

    private final String title;

    private final String message;
}
