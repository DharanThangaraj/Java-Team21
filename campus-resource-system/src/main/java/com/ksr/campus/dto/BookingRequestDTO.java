package com.ksr.campus.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class BookingRequestDTO {
    private Long resourceId;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private String purpose;
    private int participants;
}
