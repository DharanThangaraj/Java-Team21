package com.ksr.campus.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.beans.factory.annotation.Autowired;
import com.ksr.campus.service.BookingService;
import com.ksr.campus.dto.BookingRequestDTO;
import com.ksr.campus.dto.BookingResponseDTO;
import java.util.List;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @PostMapping
    public BookingResponseDTO createBooking(@RequestParam Long userId, @RequestBody BookingRequestDTO bookingRequestDTO) {
        return bookingService.createBooking(userId, bookingRequestDTO);
    }

    @PutMapping("/{id}/approve-faculty")
    public BookingResponseDTO approveByFaculty(@PathVariable Long id) {
        return bookingService.approveByFaculty(id);
    }

    @PutMapping("/{id}/approve-admin")
    public BookingResponseDTO approveByAdmin(@PathVariable Long id) {
        return bookingService.approveByAdmin(id);
    }

    @PutMapping("/{id}/reject")
    public BookingResponseDTO rejectBooking(@PathVariable Long id) {
        return bookingService.rejectBooking(id);
    }

    @GetMapping
    public List<BookingResponseDTO> getAllBookings() {
        return bookingService.getAllBookings();
    }
}
