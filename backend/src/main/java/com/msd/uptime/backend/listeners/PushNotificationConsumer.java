package com.msd.uptime.backend.listeners;

import com.msd.uptime.backend.events.NotificationEvent;
import com.msd.uptime.backend.services.SseNotificationService;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class PushNotificationConsumer {

    @Autowired
    private SseNotificationService sseNotificationService;

    @RabbitListener(queues = "${rabbitmq.push-queue:notification.push.queue}")
    public void handle(NotificationEvent event) {
        sseNotificationService.broadcast(event);
    }
}