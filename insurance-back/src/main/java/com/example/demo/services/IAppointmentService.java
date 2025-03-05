package com.example.demo.services;

import com.example.demo.entities.Appointment;

import java.util.List;
import java.util.Optional;

public interface IAppointmentService {
    Appointment createAppointment(Appointment appointment);
    Optional<Appointment> getAppointmentById(int id);
    List<Appointment> getAllAppointments();
    Appointment updateAppointment(int id, Appointment updatedAppointment);
    void deleteAppointment(int id);
    //  List<Appointment> getAppointmentsByClient(User client);
    List<Appointment> getAppointmentsByStatus(Appointment.AppointmentStatus status);
}
