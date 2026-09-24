package com.msd.uptime.backend.services;

import com.msd.uptime.backend.DTO.NotificationResponse;

import java.util.List;

public interface NotificationService {
    List<NotificationResponse> getNotificationsForUser(Long userId);
    List<NotificationResponse> getUnreadNotificationsForUser(Long userId);
    long getUnreadCount(Long userId);
    NotificationResponse markAsRead(Long notificationId, Long userId);
    void markAllAsRead(Long userId);
}