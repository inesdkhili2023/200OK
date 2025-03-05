package com.example.demo.repositories;

import com.example.demo.entities.Appointment;
import com.example.demo.entities.JobApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
public interface AppointmentRepo extends JpaRepository<Appointment, Integer> {
   // List<Appointment> findByClient(User client);
    List<Appointment> findByStatus(Appointment.AppointmentStatus status);
}
