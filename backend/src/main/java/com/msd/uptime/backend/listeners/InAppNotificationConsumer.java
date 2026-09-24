package com.msd.uptime.backend.listeners;

import com.msd.uptime.backend.DTO.NotificationResponse;
import com.msd.uptime.backend.events.NotificationEvent;
import com.msd.uptime.backend.models.Employee;
import com.msd.uptime.backend.models.Notification;
import com.msd.uptime.backend.repositories.EmployeeRepository;
import com.msd.uptime.backend.repositories.NotificationRepository;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class InAppNotificationConsumer {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @RabbitListener(queues = "${rabbitmq.in-app-queue:notification.in-app.queue}")
    public void handle(NotificationEvent event) {
        if (event.getRecipientId() == null) {
            return;
        }

        Employee recipient = employeeRepository.findById(event.getRecipientId()).orElse(null);
        if (recipient == null) {
            return;
        }

        Notification notification = new Notification();
        notification.setRecipient(recipient);
        notification.setTitle(event.getTitle());
        notification.setMessage(event.getMessage());
        notification.setNotificationType(event.getNotificationType());
        notification.setRead(false);
        notification.setCreatedAt(LocalDateTime.now());

        Notification saved = notificationRepository.save(notification);

        NotificationResponse response = new NotificationResponse(
                saved.getId(),
                saved.getTitle(),
                saved.getMessage(),
                saved.getNotificationType(),
                saved.getRecipient().getId(),
                saved.isRead(),
                saved.getCreatedAt()
        );

        messagingTemplate.convertAndSend("/topic/notifications", response);
    }
}