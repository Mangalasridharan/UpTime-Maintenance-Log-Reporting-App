package com.msd.uptime.backend.repositories;

import com.msd.uptime.backend.models.Notification;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NotificationRepository extends JpaRepository<Notification,Long> {
}
