package com.msd.uptime.backend.services;

import com.msd.uptime.backend.DTO.NotificationResponse;
import com.msd.uptime.backend.models.Notification;
import com.msd.uptime.backend.repositories.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotificationServiceImpl implements NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    @Override
    public List<NotificationResponse> getNotificationsForUser(Long userId) {
        return notificationRepository.findByRecipientIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    public List<NotificationResponse> getUnreadNotificationsForUser(Long userId) {
        return notificationRepository.findByRecipientIdAndReadFalseOrderByCreatedAtDesc(userId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    public long getUnreadCount(Long userId) {
        return notificationRepository.countByRecipientIdAndReadFalse(userId);
    }

    @Override
    public NotificationResponse markAsRead(Long notificationId, Long userId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found with id: " + notificationId));

        if (!notification.getRecipient().getId().equals(userId)) {
            throw new RuntimeException("Notification does not belong to user: " + userId);
        }

        notification.setRead(true);
        return toResponse(notificationRepository.save(notification));
    }

    @Override
    public void markAllAsRead(Long userId) {
        List<Notification> notifications =
                notificationRepository.findByRecipientIdAndReadFalseOrderByCreatedAtDesc(userId);
        notifications.forEach(n -> n.setRead(true));
        notificationRepository.saveAll(notifications);
    }

    private NotificationResponse toResponse(Notification notification) {
        return new NotificationResponse(
                notification.getId(),
                notification.getTitle(),
                notification.getMessage(),
                notification.getNotificationType(),
                notification.getRecipient().getId(),
                notification.isRead(),
                notification.getCreatedAt()
        );
    }
}