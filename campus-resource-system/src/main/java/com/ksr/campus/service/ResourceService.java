package com.ksr.campus.service;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import com.ksr.campus.repository.ResourceRepository;
import com.ksr.campus.repository.BookingRepository;
import com.ksr.campus.entity.Resource;
import com.ksr.campus.entity.Booking;
import com.ksr.campus.dto.ResourceStatsDTO;
import com.ksr.campus.dto.BookingResponseDTO;
import com.ksr.campus.enums.Status;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import java.util.HashSet;
import java.util.stream.Collectors;

@Service
public class ResourceService {

    @Autowired
    private ResourceRepository resourceRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private BookingService bookingService;

    public Resource createResource(Resource resource) {
        return resourceRepository.save(resource);
    }

    public List<Resource> getAllResources() {
        return resourceRepository.findAll();
    }

    public ResourceStatsDTO getResourceStats() {
        List<Resource> all = resourceRepository.findAll();
        // User wants booked resources after approved by admin
        List<Booking> approvedBookings = bookingRepository.findByStatus(Status.APPROVED);

        Set<Long> bookedResourceIds = new HashSet<>();
        for (Booking b : approvedBookings) {
            if (b.getResource() != null) {
                bookedResourceIds.add(b.getResource().getId());
            }
        }

        List<Resource> available = all.stream()
                .filter(r -> !bookedResourceIds.contains(r.getId()))
                .collect(Collectors.toList());

        List<BookingResponseDTO> bookedDTOs = approvedBookings.stream()
                .map(bookingService::mapToDTO)
                .collect(Collectors.toList());

        return new ResourceStatsDTO(
                all.size(),
                available.size(),
                bookedResourceIds.size(),
                all,
                available,
                bookedDTOs);
    }
}
