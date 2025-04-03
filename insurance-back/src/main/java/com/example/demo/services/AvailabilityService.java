package com.example.demo.services;

import com.example.demo.entities.Availability;
import com.example.demo.entities.AvailabilityStatus;
import com.example.demo.repositories.AvailabilityRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class AvailabilityService implements IAvailabilityService {
    @Autowired
    private AvailabilityRepo availabilityRepository;

    @Override
    public Availability createAvailability(Availability availability) {
        return availabilityRepository.save(availability);
    }
    public List<Availability> getAvailabilitiesByDate(LocalDateTime date) {
        return availabilityRepository.findByDate(date);
    }
    @Override
    public Optional<Availability> getAvailabilityById(int id) {
        return availabilityRepository.findById(id);
    }

    @Override
    public List<Availability> getAllAvailabilities() {
        return availabilityRepository.findAll();
    }

    @Override
    public Availability updateAvailability(int id, Availability updatedAvailability) {
        return availabilityRepository.findById(id)
                .map(availability -> {
                    availability.setStartTime(updatedAvailability.getStartTime());
                    availability.setEndTime(updatedAvailability.getEndTime());
                  //  availability.setAgent(updatedAvailability.getAgent());
                    return availabilityRepository.save(availability);
                })
                .orElseThrow(() -> new RuntimeException("Availability not found"));
    }

    @Override
    public void deleteAvailability(int id) {
        availabilityRepository.deleteById(id);
    }

//    @Override
//    public List<Availability> getAvailabilitiesByAgent(User agent) {
//        return availabilityRepository.findByAgent(agent);
//    }

    @Override
    public List<Availability> getAvailabilitiesByTimeRange(LocalDateTime start, LocalDateTime end) {
        return availabilityRepository.findByStartTimeBetween(start, end);
    }

    @Override
    public Availability updateAvailabilityStatus(int id, AvailabilityStatus status) {
        // Find the availability by ID
        Optional<Availability> availabilityOptional = availabilityRepository.findById(id);

        if (availabilityOptional.isPresent()) {
            Availability availability = availabilityOptional.get();
            availability.setStatus(status); // Update the status of the availability
            return availabilityRepository.save(availability); // Save the updated availability
        } else {
            throw new RuntimeException("Availability not found with ID: " + id); // Handle not found case
        }
    }

    // Get availabilities filtered by status
    public List<Availability> getAvailabilitiesByStatus(String status) {
        AvailabilityStatus availabilityStatus = AvailabilityStatus.valueOf(status);
        return availabilityRepository.findByStatus(availabilityStatus);
    }
}
