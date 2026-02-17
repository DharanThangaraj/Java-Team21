package com.ksr.campus.dto;

import com.ksr.campus.entity.Resource;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ResourceStatsDTO {
    private long totalResources;
    private long availableResources;
    private long bookedResources;
    private List<Resource> totalList;
    private List<Resource> availableList;
    private List<BookingResponseDTO> bookedList;
}
