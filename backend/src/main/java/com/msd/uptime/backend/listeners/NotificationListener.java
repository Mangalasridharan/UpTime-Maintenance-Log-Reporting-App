package com.msd.uptime.backend.listeners;

import com.msd.uptime.backend.events.NotificationEvent;
import com.msd.uptime.backend.services.NotificationProducer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

@Component
public class NotificationListener {

    @Autowired
    private NotificationProducer notificationProducer;

    @EventListener
    public void handle(NotificationEvent event) {
        notificationProducer.sendNotification(event);
    }
}