package com.msd.uptime.backend.services;

import com.msd.uptime.backend.configurations.RabbitMQConfig;
import com.msd.uptime.backend.events.NotificationEvent;
import com.msd.uptime.backend.models.NotificationType;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.amqp.rabbit.core.RabbitTemplate;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class NotificationProducerTest {

    @Mock
    private RabbitTemplate rabbitTemplate;

    @InjectMocks
    private NotificationProducer notificationProducer;

    @Test
    void sendNotification_publishesToInAppQueueForInAppType() {
        NotificationEvent event = new NotificationEvent(1L, "t", "m", NotificationType.IN_APP);

        notificationProducer.sendNotification(event);

        verify(rabbitTemplate).convertAndSend(
                eq(RabbitMQConfig.NOTIFICATION_EXCHANGE),
                eq(RabbitMQConfig.IN_APP_ROUTING_KEY),
                eq(event));
    }

    @Test
    void sendNotification_publishesToPushQueueForPushType() {
        NotificationEvent event = new NotificationEvent(1L, "t", "m", NotificationType.PUSH);

        notificationProducer.sendNotification(event);

        verify(rabbitTemplate).convertAndSend(
                eq(RabbitMQConfig.NOTIFICATION_EXCHANGE),
                eq(RabbitMQConfig.PUSH_ROUTING_KEY),
                eq(event));
    }

    @Test
    void sendNotification_publishesToBothQueuesForBothType() {
        NotificationEvent event = new NotificationEvent(1L, "t", "m", NotificationType.BOTH);

        notificationProducer.sendNotification(event);

        ArgumentCaptor<String> routingKeyCaptor = ArgumentCaptor.forClass(String.class);
        verify(rabbitTemplate, times(2)).convertAndSend(
                eq(RabbitMQConfig.NOTIFICATION_EXCHANGE),
                routingKeyCaptor.capture(),
                eq(event));

        assertThat(routingKeyCaptor.getAllValues())
                .containsExactlyInAnyOrder(RabbitMQConfig.IN_APP_ROUTING_KEY, RabbitMQConfig.PUSH_ROUTING_KEY);
    }
}