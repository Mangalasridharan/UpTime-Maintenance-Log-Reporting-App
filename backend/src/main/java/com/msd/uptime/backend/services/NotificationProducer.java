package com.msd.uptime.backend.services;

import com.msd.uptime.backend.configurations.RabbitMQConfig;
import com.msd.uptime.backend.events.NotificationEvent;
import com.msd.uptime.backend.models.NotificationType;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class NotificationProducer {

    @Autowired
    private RabbitTemplate rabbitTemplate;

    public void sendNotification(NotificationEvent event) {
        NotificationType type = event.getNotificationType();

        if (type == null || type == NotificationType.IN_APP) {
            publish(RabbitMQConfig.IN_APP_ROUTING_KEY, event);
        } else if (type == NotificationType.PUSH) {
            publish(RabbitMQConfig.PUSH_ROUTING_KEY, event);
        } else if (type == NotificationType.BOTH) {
            publish(RabbitMQConfig.IN_APP_ROUTING_KEY, event);
            publish(RabbitMQConfig.PUSH_ROUTING_KEY, event);
        }
    }

    private void publish(String routingKey, NotificationEvent event) {
        rabbitTemplate.convertAndSend(
                RabbitMQConfig.NOTIFICATION_EXCHANGE,
                routingKey,
                event
        );
    }
}