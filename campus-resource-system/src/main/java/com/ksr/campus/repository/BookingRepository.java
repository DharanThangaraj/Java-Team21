package com.ksr.campus.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.ksr.campus.entity.Booking;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

}
