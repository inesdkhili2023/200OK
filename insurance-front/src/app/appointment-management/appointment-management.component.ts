import { AfterViewInit, Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AppointmentService } from '../services/appointment.service';

@Component({
  selector: 'app-appointment-management',
  templateUrl: './appointment-management.component.html',
  styleUrls: ['./appointment-management.component.css']
})
export class AppointmentManagementComponent {
  dataSource: any[] = [];
  displayedColumns: string[] = ['clientName', 'date', 'time', 'status', 'action'];
  appointment = {
    id: 1,
    availability: null, // Make sure to populate this with actual availability data
    status: 'CONFIRMED'
  };
  constructor(private appointmentService: AppointmentService) { }

  ngOnInit(): void {
    this.loadAppointments();
  }

  loadAppointments(): void {
    this.appointmentService.getAppointments().subscribe(appointments => {
      this.dataSource = appointments;
    });
  }
  onCreateAppointment() {
    this.appointmentService.createAppointment(this.appointment).subscribe(
      (response) => {
        console.log('Appointment created successfully', response);
      },
      (error) => {
        console.error('There was an error creating the appointment', error);
      }
    );
  }
}

