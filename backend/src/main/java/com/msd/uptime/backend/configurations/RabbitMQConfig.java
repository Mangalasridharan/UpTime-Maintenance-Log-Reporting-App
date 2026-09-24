package com.msd.uptime.backend.configurations;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.TopicExchange;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

    public static final String NOTIFICATION_EXCHANGE = "notification.exchange";
    public static final String IN_APP_QUEUE = "notification.in-app.queue";
    public static final String PUSH_QUEUE = "notification.push.queue";

    public static final String IN_APP_ROUTING_KEY = "notification.in-app";
    public static final String PUSH_ROUTING_KEY = "notification.push";

    @Bean
    public TopicExchange notificationExchange() {
        return new TopicExchange(NOTIFICATION_EXCHANGE);
    }

    @Bean
    public Queue inAppNotificationQueue() {
        return new Queue(IN_APP_QUEUE, true);
    }

    @Bean
    public Queue pushNotificationQueue() {
        return new Queue(PUSH_QUEUE, true);
    }

    @Bean
    public Binding inAppBinding() {
        return BindingBuilder.bind(inAppNotificationQueue())
                .to(notificationExchange())
                .with(IN_APP_ROUTING_KEY);
    }

    @Bean
    public Binding pushBinding() {
        return BindingBuilder.bind(pushNotificationQueue())
                .to(notificationExchange())
                .with(PUSH_ROUTING_KEY);
    }

    @Bean
    public MessageConverter jsonMessageConverter() {
        return new Jackson2JsonMessageConverter();
    }

    @Bean
    public RabbitTemplate rabbitTemplate(ConnectionFactory connectionFactory) {
        RabbitTemplate rabbitTemplate = new RabbitTemplate(connectionFactory);
        rabbitTemplate.setMessageConverter(jsonMessageConverter());
        return rabbitTemplate;
    }
}