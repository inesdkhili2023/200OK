package com.example.demo.controllers;

import com.example.demo.entities.Appointment;
import com.example.demo.entities.Availability;
import com.example.demo.entities.AvailabilityStatus;
import com.example.demo.repositories.AppointmentRepo;
import com.example.demo.repositories.AvailabilityRepo;
import com.example.demo.services.AppointmentService;
import com.example.demo.services.IAppointmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("appointments/")
public class AppointmentController {
    @Autowired
    private IAppointmentService appointmentService;
    @Autowired
    AvailabilityRepo availabilityRepo;
@Autowired
    AppointmentRepo
    appointmentRepo;
    @PostMapping("add")
    public ResponseEntity<Appointment> createAppointment(@RequestBody Appointment appointment) {
        Appointment createdAppointment = appointmentService.createAppointment(appointment);
        return ResponseEntity.ok(createdAppointment);
    }
    @PostMapping("create")
    public ResponseEntity<?> createApp(@RequestBody Appointment appointment) {
        try {
            // Vérifier si la disponibilité existe déjà
            Optional<Availability> existingAvailability = availabilityRepo.findByDateAndStartTime(
                    appointment.getAvailability().getDate(),
                    appointment.getAvailability().getStartTime()
            );

            Availability availability;
            if (existingAvailability.isPresent()) {
                availability = existingAvailability.get();
            } else {
                // Sauvegarde de la disponibilité avant de l'attacher à l'appointment
                Availability newAvailability = new Availability();
                newAvailability.setDate(appointment.getAvailability().getDate());
                newAvailability.setStartTime(appointment.getAvailability().getStartTime());
                newAvailability.setStatus(AvailabilityStatus.BOOKED);

                availability = availabilityRepo.save(newAvailability);
            }

            // Attacher la disponibilité persistée à l'appointment
            appointment.setAvailability(availability);
            appointment.setStatus(Appointment.AppointmentStatus.CONFIRMED);

            // Sauvegarde de l'appointment
            Appointment savedAppointment = appointmentRepo.save(appointment);
            return new ResponseEntity<>(savedAppointment, HttpStatus.CREATED);

        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Obtenir un rendez-vous par ID
    @GetMapping("{id}")
    public ResponseEntity<Appointment> getAppointment(@PathVariable int id) {
        Optional<Appointment> appointment = appointmentService.getAppointmentById(id);
        return appointment.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Obtenir tous les rendez-vous
    @GetMapping("getAll")
    public List<Appointment> getAllAppointments() {
        return appointmentService.getAllAppointments();
    }

    // Mettre à jour un rendez-vous
    @PutMapping("{id}")
    public ResponseEntity<Appointment> updateAppointment(@PathVariable int id, @RequestBody Appointment updatedAppointment) {
        Appointment appointment = appointmentService.updateAppointment(id, updatedAppointment);
        return ResponseEntity.ok(appointment);
    }

    // Supprimer un rendez-vous
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAppointment(@PathVariable int id) {
        appointmentService.deleteAppointment(id);
        return ResponseEntity.noContent().build();
    }

    // Rechercher les rendez-vous par client
//    @GetMapping("/client/{clientId}")
//    public List<Appointment> getAppointmentsByClient(@PathVariable Long clientId) {
//        User client = new User(); // Vous devez obtenir l'utilisateur par son ID (ex : avec un service User)
//        client.setId(clientId);   // Remplacez cette logique par la récupération réelle de l'utilisateur
//        return appointmentService.getAppointmentsByClient(client);
//    }

    // Rechercher les rendez-vous par statut
    @GetMapping("/status/{status}")
    public List<Appointment> getAppointmentsByStatus(@PathVariable Appointment.AppointmentStatus status) {
        return appointmentService.getAppointmentsByStatus(status);
    }
}
