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

    public BookingResponseDTO createBooking(Long userId, BookingRequestDTO request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Resource resource = resourceRepository.findById(request.getResourceId())
                .orElseThrow(() -> new ResourceNotFoundException("Resource not found"));

        Booking booking = new Booking();
        booking.setUser(user);
        booking.setResource(resource);
        booking.setStartTime(request.getStartTime());
        booking.setEndTime(request.getEndTime());
        booking.setPurpose(request.getPurpose());

        if (user.getRole() == Role.STUDENT) {
            booking.setStatus(Status.PENDING_FACULTY);
        } else if (user.getRole() == Role.FACULTY) {
            booking.setStatus(Status.PENDING_ADMIN);
        } else if (user.getRole() == Role.ADMIN) {
            booking.setStatus(Status.APPROVED);
        }

        Booking savedBooking = bookingRepository.save(booking);
        return mapToDTO(savedBooking);
    }

    public BookingResponseDTO approveByFaculty(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        if (booking.getStatus() == Status.PENDING_FACULTY) {
            booking.setStatus(Status.PENDING_ADMIN);
            return mapToDTO(bookingRepository.save(booking));
        }
        throw new RuntimeException("Booking is not pending faculty approval");
    }

    public BookingResponseDTO approveByAdmin(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        if (booking.getStatus() == Status.PENDING_ADMIN) {
            booking.setStatus(Status.APPROVED);
            return mapToDTO(bookingRepository.save(booking));
        }
        throw new RuntimeException("Booking is not pending admin approval");
    }

    public BookingResponseDTO rejectBooking(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        booking.setStatus(Status.REJECTED);
        return mapToDTO(bookingRepository.save(booking));
    }

    public List<BookingResponseDTO> getAllBookings() {
        return bookingRepository.findAll().stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    private BookingResponseDTO mapToDTO(Booking booking) {
        BookingResponseDTO dto = new BookingResponseDTO();
        dto.setId(booking.getId());
        dto.setUserId(booking.getUser().getId());
        dto.setResourceId(booking.getResource().getId());
        dto.setStartTime(booking.getStartTime());
        dto.setEndTime(booking.getEndTime());
        dto.setPurpose(booking.getPurpose());
        dto.setStatus(booking.getStatus());
        return dto;
    }
}
