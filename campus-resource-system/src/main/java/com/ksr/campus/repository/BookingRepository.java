package com.ksr.campus.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import com.ksr.campus.entity.Booking;
import com.ksr.campus.enums.Status;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    @Query("SELECT COUNT(DISTINCT b.resource.id) FROM Booking b WHERE b.status = :status " +
            "AND :now BETWEEN b.startTime AND b.endTime")
    long countActiveBookings(@Param("status") Status status, @Param("now") LocalDateTime now);

    @Query("SELECT b FROM Booking b WHERE b.status = :status AND :now BETWEEN b.startTime AND b.endTime")
    List<Booking> findActiveBookings(@Param("status") Status status, @Param("now") LocalDateTime now);

    List<Booking> findByStatus(Status status);
}
