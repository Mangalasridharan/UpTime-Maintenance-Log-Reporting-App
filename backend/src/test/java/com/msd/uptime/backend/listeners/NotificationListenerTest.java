package com.msd.uptime.backend.listeners;

import com.msd.uptime.backend.events.NotificationEvent;
import com.msd.uptime.backend.services.NotificationProducer;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class NotificationListenerTest {

    @Mock
    private NotificationProducer notificationProducer;

    @InjectMocks
    private NotificationListener notificationListener;

    @Test
    void handle_forwardsEventToRabbitProducer() {
        NotificationEvent event =
                new NotificationEvent(1L, "New Complaint Raised", "A machine failed",
                        com.msd.uptime.backend.models.NotificationType.IN_APP);

        notificationListener.handle(event);

        verify(notificationProducer).sendNotification(event);
    }
}