package com.example.demo.controllers;

import com.example.demo.entities.Availability;
import com.example.demo.entities.AvailabilityStatus;
import com.example.demo.repositories.AvailabilityRepo;
import com.example.demo.services.AvailabilityService;
import com.example.demo.services.IAvailabilityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("availabilities/")
public class AvailabilityController {
    @Autowired
    private AvailabilityService availabilityService;
    @Autowired
    private IAvailabilityService iavailabilityService;
    @Autowired
    AvailabilityRepo availabilityRepo;

    @Autowired
    public AvailabilityController(AvailabilityService availabilityService) {
        this.availabilityService = availabilityService;
    }

    // Create a new availability
    @PostMapping("add")
    public ResponseEntity<Availability> createAvailability(@RequestBody Availability availability) {
        Availability createdAvailability = availabilityService.createAvailability(availability);
        return new ResponseEntity<>(createdAvailability, HttpStatus.CREATED);
    }

    // Get availability by ID
    @GetMapping("{id}")
    public ResponseEntity<Availability> getAvailabilityById(@PathVariable int id) {
        Optional<Availability> availability = availabilityService.getAvailabilityById(id);
        return availability.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Get all availabilities
    @GetMapping("getAll")
    public ResponseEntity<List<Availability>> getAllAvailabilities() {
        List<Availability> availabilities = availabilityService.getAllAvailabilities();
        return ResponseEntity.ok(availabilities);
    }

    // Update availability by ID
    @PutMapping("/{id}")
    public ResponseEntity<Availability> updateAvailability(@PathVariable int id, @RequestBody Availability updatedAvailability) {
        try {
            Availability updated = availabilityService.updateAvailability(id, updatedAvailability);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    // Delete availability by ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAvailability(@PathVariable int id) {
        try {
            availabilityService.deleteAvailability(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
    @GetMapping(params = "date")
    public List<Availability> getAvailabilitiesByDate(@RequestParam LocalDateTime date) {
        return availabilityService.getAvailabilitiesByDate(date);
    }
    // Get availabilities within a time range
    @GetMapping("time-range")
    public ResponseEntity<List<Availability>> getAvailabilitiesByTimeRange(
            @RequestParam("start") LocalDateTime start,
            @RequestParam("end") LocalDateTime end) {
        List<Availability> availabilities = availabilityService.getAvailabilitiesByTimeRange(start, end);
        return ResponseEntity.ok(availabilities);
    }
    @GetMapping("available")
    public List<Availability> getAvailableSlots() {
        return availabilityRepo.findByStatus(AvailabilityStatus.AVAILABLE);
    }
    @GetMapping("/availabilities/filter")
    public List<Availability> getAvailabilitiesByStatus(@RequestParam String status) {
        return availabilityService.getAvailabilitiesByStatus(status);
    }
    // Update availability status by ID
    @PutMapping("{id}/status")
    public ResponseEntity<Availability> updateAvailabilityStatus(@PathVariable int id, @RequestParam String status) {
        try {
            Availability updatedAvailability = iavailabilityService.updateAvailabilityStatus(id, AvailabilityStatus.valueOf(status));
            return ResponseEntity.ok(updatedAvailability);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(null);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    // Méthode pour récupérer les disponibilités d'un utilisateur spécifique
//    @GetMapping("user/{userId}")
//    public ResponseEntity<List<Availability>> getAvailabilitiesByUserId(@PathVariable int userId) {
//        List<Availability> availabilities = availabilityService.getAvailabilitiesByUserId(userId);
//        if (availabilities.isEmpty()) {
//            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
//        }
//        return ResponseEntity.ok(availabilities);
//    }



}

