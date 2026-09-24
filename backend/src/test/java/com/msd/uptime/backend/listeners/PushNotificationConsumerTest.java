package com.msd.uptime.backend.listeners;

import com.msd.uptime.backend.events.NotificationEvent;
import com.msd.uptime.backend.models.NotificationType;
import com.msd.uptime.backend.services.SseNotificationService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class PushNotificationConsumerTest {

    @Mock
    private SseNotificationService sseNotificationService;

    @InjectMocks
    private PushNotificationConsumer consumer;

    @Test
    void handle_broadcastsViaSse() {
        NotificationEvent event =
                new NotificationEvent(1L, "New Complaint Raised", "A machine failed", NotificationType.PUSH);

        consumer.handle(event);

        verify(sseNotificationService).broadcast(event);
    }
}