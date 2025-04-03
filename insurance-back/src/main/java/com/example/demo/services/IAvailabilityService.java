package com.example.demo.services;

import com.example.demo.entities.Availability;
import com.example.demo.entities.AvailabilityStatus;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface IAvailabilityService {

    Availability createAvailability(Availability availability);
    Optional<Availability> getAvailabilityById(int id);
    List<Availability> getAllAvailabilities();
    Availability updateAvailability(int id, Availability updatedAvailability);
    void deleteAvailability(int id);
    //  List<Availability> getAvailabilitiesByAgent(User agent);
    // Rechercher les disponibilités par plage horaire
    List<Availability> getAvailabilitiesByTimeRange(LocalDateTime start, LocalDateTime end);

    Availability updateAvailabilityStatus(int id, AvailabilityStatus availabilityStatus);
}

