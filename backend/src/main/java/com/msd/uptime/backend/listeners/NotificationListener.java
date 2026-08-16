package com.msd.uptime.backend.listeners;

import com.msd.uptime.backend.DTO.NotificationResponse;
import com.msd.uptime.backend.events.NotificationEvent;
import com.msd.uptime.backend.models.Notification;
import com.msd.uptime.backend.repositories.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class NotificationListener {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @EventListener
    public void handle(NotificationEvent event) {

        Notification notification = new Notification();

        notification.setRecipient(event.getRecipient());
        notification.setTitle(event.getTitle());
        notification.setMessage(event.getMessage());
        notification.setRead(false);
        notification.setCreatedAt(LocalDateTime.now());

        Notification saved = notificationRepository.save(notification);

        NotificationResponse response = new NotificationResponse(
                saved.getId(),
                saved.getTitle(),
                saved.getMessage(),
                saved.isRead(),
                saved.getCreatedAt()
        );

        messagingTemplate.convertAndSend(
                "/topic/notifications",
                response
        );
    }
}