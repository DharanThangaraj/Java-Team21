package com.ksr.campus.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private User user;

    private String message;
    private boolean isRead = false;
    private LocalDateTime createdAt = LocalDateTime.now();
}
