package com.msd.uptime.backend.controllers;

import com.msd.uptime.backend.DTO.NotificationResponse;
import com.msd.uptime.backend.response.ApiResponse;
import com.msd.uptime.backend.services.NotificationService;
import com.msd.uptime.backend.services.SseNotificationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/uptime/api/v1/notifications")
@Tag(name = "Notification", description = "In-app and push notification management")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private SseNotificationService sseNotificationService;

    @GetMapping("/user/{userId}")
    @Operation(summary = "Get all notifications for a user")
    public ResponseEntity<ApiResponse<List<NotificationResponse>>> getNotifications(@PathVariable Long userId) {
        return ResponseEntity.ok(ApiResponse.success("Notifications fetched successfully",
                notificationService.getNotificationsForUser(userId)));
    }

    @GetMapping("/user/{userId}/unread")
    @Operation(summary = "Get unread notifications for a user")
    public ResponseEntity<ApiResponse<List<NotificationResponse>>> getUnread(@PathVariable Long userId) {
        return ResponseEntity.ok(ApiResponse.success("Unread notifications fetched successfully",
                notificationService.getUnreadNotificationsForUser(userId)));
    }

    @GetMapping("/user/{userId}/unread-count")
    @Operation(summary = "Get unread notification count for a user")
    public ResponseEntity<ApiResponse<Long>> getUnreadCount(@PathVariable Long userId) {
        return ResponseEntity.ok(ApiResponse.success("Unread count fetched successfully",
                notificationService.getUnreadCount(userId)));
    }

    @PatchMapping("/{id}/read")
    @Operation(summary = "Mark a notification as read")
    public ResponseEntity<ApiResponse<NotificationResponse>> markAsRead(
            @PathVariable Long id,
            @RequestParam Long userId) {
        return ResponseEntity.ok(ApiResponse.success("Notification marked as read",
                notificationService.markAsRead(id, userId)));
    }

    @PatchMapping("/user/{userId}/read-all")
    @Operation(summary = "Mark all notifications as read for a user")
    public ResponseEntity<ApiResponse<Void>> markAllAsRead(@PathVariable Long userId) {
        notificationService.markAllAsRead(userId);
        return ResponseEntity.ok(ApiResponse.<Void>success("All notifications marked as read", null));
    }

    @GetMapping(value = "/stream/{userId}", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    @Operation(summary = "Subscribe to real-time push notifications via SSE")
    public SseEmitter subscribe(@PathVariable Long userId) {
        return sseNotificationService.subscribe(userId);
    }

    @GetMapping("/health")
    @Operation(summary = "Notification service health", hidden = true)
    public Map<String, String> health() {
        return Map.of("status", "UP");
    }
}