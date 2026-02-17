package com.ksr.campus.controller;

import com.ksr.campus.entity.Notification;
import com.ksr.campus.entity.User;
import com.ksr.campus.repository.UserRepository;
import com.ksr.campus.service.NotificationService;
import com.ksr.campus.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {
    @Autowired
    private NotificationService notificationService;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public List<Notification> getNotifications(@RequestParam Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return notificationService.getNotificationsForUser(user);
    }

    @PutMapping("/{id}/read")
    public void markAsRead(@PathVariable Long id) {
        notificationService.markAsRead(id);
    }

    @PutMapping("/read-all")
    public void markAllAsRead(@RequestParam Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new com.ksr.campus.exception.ResourceNotFoundException("User not found"));
        notificationService.markAllAsReadForUser(user);
    }
}
