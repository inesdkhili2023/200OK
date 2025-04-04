package com.example.demo.repositories;

import com.example.demo.entities.Appointment;
import com.example.demo.entities.Availability;
import com.example.demo.entities.AvailabilityStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface AvailabilityRepo extends JpaRepository<Availability, Integer> {
    //List<Availability> findByAgent(User agent);
    //List<Availability> findByUserId(int userId);

    List<Availability> findByStartTimeBetween(LocalDateTime start, LocalDateTime end);

     Optional<Availability> findByDateAndStartTime(LocalDate date, LocalTime startTime);
    List<Availability> findByStatus(AvailabilityStatus status);
    List<Availability> findByDate(LocalDateTime date);


}
