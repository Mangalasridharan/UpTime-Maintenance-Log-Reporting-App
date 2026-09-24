package com.msd.uptime.backend.services;

import com.msd.uptime.backend.events.NotificationEvent;
import com.msd.uptime.backend.models.Employee;
import com.msd.uptime.backend.repositories.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;

@Service
public class SseNotificationService {

    private final Map<Long, List<SseEmitter>> emittersByUserId = new ConcurrentHashMap<>();

    @Autowired
    private EmployeeRepository employeeRepository;

    public SseEmitter subscribe(Long userId) {
        SseEmitter emitter = new SseEmitter(0L);
        emittersByUserId.computeIfAbsent(userId, k -> new CopyOnWriteArrayList<>()).add(emitter);

        emitter.onCompletion(() -> removeEmitter(userId, emitter));
        emitter.onTimeout(() -> removeEmitter(userId, emitter));
        emitter.onError(e -> removeEmitter(userId, emitter));

        try {
            emitter.send(SseEmitter.event().name("connected").data("Push notification stream connected"));
        } catch (IOException e) {
            emitter.completeWithError(e);
        }
        return emitter;
    }

    public void broadcast(NotificationEvent event) {
        Long recipientId = event.getRecipientId();
        if (recipientId == null) {
            return;
        }

        Employee recipient = employeeRepository.findById(recipientId).orElse(null);
        if (recipient == null) {
            return;
        }

        PushNotification push = new PushNotification(
                recipient.getUsername(),
                event.getTitle(),
                event.getMessage()
        );

        List<SseEmitter> emitters = emittersByUserId.get(recipientId);
        if (emitters == null || emitters.isEmpty()) {
            return;
        }

        for (SseEmitter emitter : emitters) {
            try {
                emitter.send(SseEmitter.event().name("notification").data(push));
            } catch (IOException e) {
                removeEmitter(recipientId, emitter);
            }
        }
    }

    private void removeEmitter(Long userId, SseEmitter emitter) {
        List<SseEmitter> emitters = emittersByUserId.get(userId);
        if (emitters != null) {
            emitters.remove(emitter);
            if (emitters.isEmpty()) {
                emittersByUserId.remove(userId);
            }
        }
    }

    public record PushNotification(String recipient, String title, String message) {}
}