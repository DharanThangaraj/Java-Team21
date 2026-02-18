package com.ksr.campus.service;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import com.ksr.campus.repository.BookingRepository;
import com.ksr.campus.repository.UserRepository;
import com.ksr.campus.repository.ResourceRepository;
import com.ksr.campus.entity.Booking;
import com.ksr.campus.entity.User;
import com.ksr.campus.entity.Resource;
import com.ksr.campus.dto.BookingRequestDTO;
import com.ksr.campus.dto.BookingResponseDTO;
import com.ksr.campus.enums.Role;
import com.ksr.campus.enums.Status;
import com.ksr.campus.exception.ResourceNotFoundException;
import java.time.Duration;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ResourceRepository resourceRepository;

    @Autowired
    private NotificationService notificationService;

    public BookingResponseDTO createBooking(Long userId, BookingRequestDTO request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Resource resource = resourceRepository.findById(request.getResourceId())
                .orElseThrow(() -> new ResourceNotFoundException("Resource not found"));

        validateBooking(user, request);

        Booking booking = new Booking();
        booking.setUser(user);
        booking.setResource(resource);
        booking.setStartTime(request.getStartTime());
        booking.setEndTime(request.getEndTime());
        booking.setPurpose(request.getPurpose());
        booking.setParticipants(request.getParticipants());

        if (user.getRole() == Role.STUDENT) {
            booking.setStatus(Status.PENDING_FACULTY);
            userRepository.findAll().stream().filter(u -> u.getRole() == Role.FACULTY)
                    .forEach(f -> notificationService.createNotification(f,
                            "New booking request from student: " + user.getName()));
        } else if (user.getRole() == Role.FACULTY) {
            booking.setStatus(Status.PENDING_ADMIN);
            userRepository.findAll().stream().filter(u -> u.getRole() == Role.ADMIN)
                    .forEach(a -> notificationService.createNotification(a,
                            "New booking request from faculty: " + user.getName()));
        } else if (user.getRole() == Role.ADMIN) {
            booking.setStatus(Status.APPROVED);
        }

        Booking savedBooking = bookingRepository.save(booking);
        return mapToDTO(savedBooking);
    }

    private void validateBooking(User user, BookingRequestDTO request) {
        LocalTime start = request.getStartTime().toLocalTime();
        LocalTime end = request.getEndTime().toLocalTime();
        Duration duration = Duration.between(request.getStartTime(), request.getEndTime());

        // 1. Working Hours
        if (start.isBefore(LocalTime.of(9, 0)) || end.isAfter(LocalTime.of(17, 0))) {
            throw new IllegalArgumentException("Select at working hours (9 AM - 5 PM)");
        }

        // 2. Break Times
        if (isOverlapping(start, end, LocalTime.of(10, 30), LocalTime.of(11, 0))) {
            throw new IllegalArgumentException("Booking overlaps with morning break (10:30 AM - 11:00 AM)");
        }
        if (isOverlapping(start, end, LocalTime.of(12, 30), LocalTime.of(13, 30))) {
            throw new IllegalArgumentException("Booking overlaps with lunch time (12:30 PM - 01:30 PM)");
        }

        // 3. Role-Based Duration
        long maxHours = 0;
        if (user.getRole() == Role.STUDENT)
            maxHours = 2;
        else if (user.getRole() == Role.FACULTY)
            maxHours = 3;
        else if (user.getRole() == Role.ADMIN)
            maxHours = 8;

        if (duration.toMinutes() > maxHours * 60) {
            throw new IllegalArgumentException("Maximum duration for " + user.getRole() + " is " + maxHours + " hours");
        }

        // 4. Capacity Check
        Resource resource = resourceRepository.findById(request.getResourceId())
                .orElseThrow(() -> new ResourceNotFoundException("Resource not found"));
        if (request.getParticipants() > resource.getCapacity()) {
            throw new IllegalArgumentException("Booking participants (" + request.getParticipants() +
                    ") exceed resource capacity (" + resource.getCapacity() + ")");
        }
    }

    private boolean isOverlapping(LocalTime start1, LocalTime end1, LocalTime start2, LocalTime end2) {
        return start1.isBefore(end2) && start2.isBefore(end1);
    }

    public BookingResponseDTO approveByFaculty(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        if (booking.getStatus() == Status.PENDING_FACULTY) {
            booking.setStatus(Status.PENDING_ADMIN);
            Booking updatedBooking = bookingRepository.save(booking);
            userRepository.findAll().stream().filter(u -> u.getRole() == Role.ADMIN)
                    .forEach(a -> notificationService.createNotification(a,
                            "Faculty approved student booking: " + booking.getId()));
            return mapToDTO(updatedBooking);
        }
        throw new RuntimeException("Booking is not pending faculty approval");
    }

    public BookingResponseDTO approveByAdmin(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        if (booking.getStatus() == Status.PENDING_ADMIN) {
            booking.setStatus(Status.APPROVED);
            Booking updatedBooking = bookingRepository.save(booking);
            notificationService.createNotification(booking.getUser(), "Your booking has been approved by admin.");
            if (booking.getUser().getRole() == Role.STUDENT) {
                userRepository.findAll().stream().filter(u -> u.getRole() == Role.FACULTY)
                        .forEach(f -> notificationService.createNotification(f,
                                "Admin approved student booking you recommended: " + booking.getId()));
            }
            return mapToDTO(updatedBooking);
        }
        throw new RuntimeException("Booking is not pending admin approval");
    }

    public BookingResponseDTO rejectBooking(Long bookingId, String reason) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        booking.setStatus(Status.REJECTED);
        booking.setRejectionReason(reason);
        Booking updatedBooking = bookingRepository.save(booking);

        notificationService.createNotification(booking.getUser(), "Your booking has been rejected. Reason: " + reason);
        return mapToDTO(updatedBooking);
    }

    public List<BookingResponseDTO> getAllBookings() {
        return bookingRepository.findAll().stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    public BookingResponseDTO mapToDTO(Booking booking) {
        BookingResponseDTO dto = new BookingResponseDTO();
        dto.setId(booking.getId());
        dto.setUserId(booking.getUser().getId());
        dto.setUserName(booking.getUser().getName());
        dto.setResourceId(booking.getResource().getId());
        dto.setResourceName(booking.getResource().getName());
        dto.setStartTime(booking.getStartTime());
        dto.setEndTime(booking.getEndTime());
        dto.setPurpose(booking.getPurpose());
        dto.setParticipants(booking.getParticipants());
        dto.setStatus(booking.getStatus());
        dto.setRejectionReason(booking.getRejectionReason());
        return dto;
    }
}
