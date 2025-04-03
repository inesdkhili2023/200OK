package com.example.demo.controllers;

import com.example.demo.entities.Appointment;
import com.example.demo.entities.Availability;
import com.example.demo.entities.AvailabilityStatus;
import com.example.demo.repositories.AppointmentRepo;
import com.example.demo.repositories.AvailabilityRepo;
import com.example.demo.services.AppointmentService;
import com.example.demo.services.IAppointmentService;
import com.example.demo.services.SmsAppointmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.web.bind.annotation.*;

import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.Date;
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
    AppointmentRepo appointmentRepo;
    @Autowired
    private SmsAppointmentService twilioService;
    @PostMapping("add")
    public ResponseEntity<Appointment> createAppointment(@RequestBody Appointment appointment) {
        System.out.println("Creating appointment: " + appointment);
        String PhoneNumber = "+21653378560";
        String message = "Your appointment is confirmed for " + formatDate(appointment.getCreatedAt())
                + " at " +appointment.getSelectedSlot();
        twilioService.sendSms(PhoneNumber,message);
        Appointment createdAppointment = appointmentService.createAppointment(appointment);
        return ResponseEntity.ok(createdAppointment);



    }
    @PostMapping("create")
    public ResponseEntity<?> createApp(@RequestBody Appointment appointment) {
        try {
            if (appointment.getAvailability() == null || appointment.getAvailability().getId() == 0) {
                return new ResponseEntity<>("Availability must not be null", HttpStatus.BAD_REQUEST);
            }

            // Récupérer la disponibilité existante par ID
            Optional<Availability> existingAvailability = availabilityRepo.findById(appointment.getAvailability().getId());

            if (!existingAvailability.isPresent()) {
                return new ResponseEntity<>("Availability not found", HttpStatus.NOT_FOUND);
            }

            // Attacher la disponibilité existante à l'appointment
            appointment.setAvailability(existingAvailability.get());
            appointment.setStatus(Appointment.AppointmentStatus.CONFIRMED);

            // Sauvegarde de l'appointment
            Appointment savedAppointment = appointmentRepo.save(appointment);

            // Envoi du SMS de confirmation (si nécessaire)
            String phoneNumber = "+21653378560";
            String message = "Votre rendez-vous est confirmé pour le " + formatDate(appointment.getCreatedAt())
                    + " à " + appointment.getSelectedSlot();
            twilioService.sendSms(phoneNumber, message);

            return new ResponseEntity<>(savedAppointment, HttpStatus.CREATED);

        } catch (Exception e) {
            e.printStackTrace(); // Ajoutez ce log pour voir l'erreur exacte
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @Scheduled(cron = "0 0 * * * ?")  // Exécute toutes les heures
    public void updateAppointmentStatus() {
        List<Appointment> confirmedAppointments = appointmentRepo.findByStatus(Appointment.AppointmentStatus.CONFIRMED);

        for (Appointment appointment : confirmedAppointments) {
            // Vérifier si la date et l'heure du rendez-vous sont passées
            if (isAppointmentPassed(appointment)) {
                // Mettre à jour le statut du rendez-vous à "COMPLETED"
                appointment.setStatus(Appointment.AppointmentStatus.COMPLETED);
                appointmentRepo.save(appointment);
                System.out.println("🔹 Le rendez-vous avec ID " + appointment.getId() + " a été mis à jour à COMPLETED.");
            }
        }
    }

    private boolean isAppointmentPassed(Appointment appointment) {
        // Vérifier si la date et l'heure sont passées
        LocalDateTime appointmentDateTime = LocalDateTime.of(appointment.getCreatedAt().toLocalDate(), LocalTime.parse(appointment.getSelectedSlot()));
        LocalDateTime currentDateTime = LocalDateTime.now();

        // Retourne true si la date et l'heure du rendez-vous sont passées
        return appointmentDateTime.isBefore(currentDateTime);
    }


    public String formatDate(LocalDateTime dateTime) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        return dateTime.format(formatter);
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
    @PutMapping("{id}/status")
    public ResponseEntity<?> updateAppointmentStatus(@PathVariable int id, @RequestBody String newStatus) {
        Optional<Appointment> optionalAppointment = appointmentRepo.findById(id);

        if (!optionalAppointment.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Appointment not found");
        }

        Appointment appointment = optionalAppointment.get();

        try {
            Appointment.AppointmentStatus statusEnum = Appointment.AppointmentStatus.valueOf(newStatus);
            appointment.setStatus(statusEnum);
            appointmentRepo.save(appointment);
            // Si le statut est 'CANCELED', envoi du SMS via Twilio
            if (statusEnum == Appointment.AppointmentStatus.CANCELED) {
                String phoneNumber = "+21653378560"; // Assurez-vous de récupérer le bon numéro
                String message = "Votre rendez-vous du " + formatDate(appointment.getCreatedAt())
                        + " à " + appointment.getSelectedSlot() + " est annulé.";
                twilioService.sendSms(phoneNumber, message);  // Appel à la méthode pour envoyer le SMS
            }
            return ResponseEntity.ok(appointment);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid status provided");
        }
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
    @GetMapping("status/{status}")
    public List<Appointment> getAppointmentsByStatus(@PathVariable Appointment.AppointmentStatus status) {
        return appointmentService.getAppointmentsByStatus(status);
    }
}
