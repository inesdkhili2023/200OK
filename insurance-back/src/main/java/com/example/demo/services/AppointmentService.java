package com.example.demo.services;

import com.example.demo.entities.Appointment;
import com.example.demo.repositories.AppointmentRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AppointmentService implements IAppointmentService {
    @Autowired
    private AppointmentRepo appointmentRepository;

    public Appointment createAppointment(Appointment appointment) {
        return appointmentRepository.save(appointment);
    }

    public Optional<Appointment> getAppointmentById(int id) {
        return appointmentRepository.findById(id);
    }

    public List<Appointment> getAllAppointments() {
        return appointmentRepository.findAll();
    }

    public Appointment updateAppointment(int id, Appointment updatedAppointment) {
        return appointmentRepository.findById(id)
                .map(appointment -> {
                   // appointment.setClient(updatedAppointment.getClient());
                    appointment.setAvailability(updatedAppointment.getAvailability());
                    appointment.setStatus(updatedAppointment.getStatus());
                    return appointmentRepository.save(appointment);
                })
                .orElseThrow(() -> new RuntimeException("Appointment not found"));
    }

    public void deleteAppointment(int id) {
        appointmentRepository.deleteById(id);
    }

    // Rechercher les rendez-vous d'un client
//    public List<Appointment> getAppointmentsByClient(User client) {
//        return appointmentRepository.findByClient(client);
//    }

    public List<Appointment> getAppointmentsByStatus(Appointment.AppointmentStatus status) {
        return appointmentRepository.findByStatus(status);
    }
}
