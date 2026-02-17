package com.ksr.campus.dto;

import lombok.Data;
import java.time.LocalDateTime;
import com.ksr.campus.enums.Status;

@Data
public class BookingResponseDTO {
    private Long id;
    private Long userId;
    private Long resourceId;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private String purpose;
    private Status status;
}
