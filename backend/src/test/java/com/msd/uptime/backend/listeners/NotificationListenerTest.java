package com.msd.uptime.backend.listeners;

import com.msd.uptime.backend.DTO.NotificationResponse;
import com.msd.uptime.backend.events.NotificationEvent;
import com.msd.uptime.backend.models.Employee;
import com.msd.uptime.backend.models.EmployeeRole;
import com.msd.uptime.backend.models.Notification;
import com.msd.uptime.backend.repositories.NotificationRepository;
import com.msd.uptime.backend.support.TestDataFactory;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class NotificationListenerTest {

    @Mock
    private NotificationRepository notificationRepository;

    @Mock
    private SimpMessagingTemplate messagingTemplate;

    @InjectMocks
    private NotificationListener notificationListener;

    @Test
    void handle_persistsNotificationAndBroadcastsResponse() {
        Employee recipient = TestDataFactory.employee(
                1L, "jano", "jano@test.com", EmployeeRole.SHIFT_WORKER, null, null);
        NotificationEvent event =
                new NotificationEvent(recipient, "New Complaint Raised", "A machine failed");

        when(notificationRepository.save(any(Notification.class))).thenAnswer(invocation -> {
            Notification notification = invocation.getArgument(0);
            notification.setId(42L);
            return notification;
        });

        notificationListener.handle(event);

        ArgumentCaptor<Notification> notificationCaptor = ArgumentCaptor.forClass(Notification.class);
        verify(notificationRepository).save(notificationCaptor.capture());
        Notification saved = notificationCaptor.getValue();
        assertThat(saved.getRecipient()).isEqualTo(recipient);
        assertThat(saved.getTitle()).isEqualTo("New Complaint Raised");
        assertThat(saved.getMessage()).isEqualTo("A machine failed");
        assertThat(saved.isRead()).isFalse();
        assertThat(saved.getCreatedAt()).isNotNull();

        ArgumentCaptor<NotificationResponse> responseCaptor =
                ArgumentCaptor.forClass(NotificationResponse.class);
        verify(messagingTemplate).convertAndSend(eq("/topic/notifications"), responseCaptor.capture());
        NotificationResponse response = responseCaptor.getValue();
        assertThat(response.id()).isEqualTo(42L);
        assertThat(response.title()).isEqualTo("New Complaint Raised");
        assertThat(response.message()).isEqualTo("A machine failed");
        assertThat(response.read()).isFalse();
        assertThat(response.createdAt()).isNotNull();
    }
}