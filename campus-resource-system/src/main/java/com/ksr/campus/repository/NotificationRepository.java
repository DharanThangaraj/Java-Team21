package com.ksr.campus.repository;

import com.ksr.campus.entity.Notification;
import com.ksr.campus.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByUserOrderByCreatedAtDesc(User user);
}
