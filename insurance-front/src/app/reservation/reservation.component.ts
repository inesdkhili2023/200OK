import { Component, OnInit } from '@angular/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { AppointmentService } from '../services/appointment.service';
import { AvailabilityService } from '../services/availability.service';

@Component({
  selector: 'app-reservation',
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.css']
})
export class ReservationComponent implements OnInit {
  selectedDate!: string;
  selectedTime!: string;
  availableTimes: string[] = [];
  isLoading = false;
  calendarEvents: any[] = []; 
  availableDates: { id:Int16Array,date: string, startTime: string, endTime: string }[] = [];

  calendarOptions: any = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin, interactionPlugin],
    dateClick: this.onDateClick.bind(this),
    events: []
  };

  constructor(
    private appointmentService: AppointmentService,
    private availabilityService: AvailabilityService
  ) {}

  ngOnInit() {
    this.loadAvailabilities();
  }

  loadAvailabilities() {
    this.availabilityService.getAvailabilities().subscribe(
      (availabilities: any[]) => { // Ici on reçoit bien les données de l'API
        this.availableDates = availabilities.map(a => ({
          id: a.id,  // 🔹 Assurer que l'id est présent
          date: a.date,
          startTime: a.startTime, 
          endTime: a.endTime
        }));
  
        // 🔹 Mettre à jour le calendrier
        this.calendarOptions = {
          ...this.calendarOptions, 
          events: this.availableDates.map(a => ({
            title: '📅 Dispo',
            date: a.date,
            color: 'green'
          }))
        };
      },
      (error) => {
        console.error('Erreur lors du chargement des disponibilités :', error);
      }
    );
  }
  

  onDateClick(info: any) {
    const availability = this.availableDates.find(a => a.date === info.dateStr);
    if (availability) {
      this.selectedDate = info.dateStr;
      this.availableTimes = this.generateTimeSlots(availability.startTime, availability.endTime);
    } else {
      this.selectedDate = '';
      this.availableTimes = [];
      alert("Aucune disponibilité pour cette date.");
    }
  }
  

  onTimeSelect(time: string) {
    this.selectedTime = time;
  }

  confirmReservation() {
    if (!this.selectedDate || !this.selectedTime) {
      alert('Veuillez sélectionner une date et une heure.');
      return;
    }
  
    // 🔹 Trouver la disponibilité correspondant à la date sélectionnée
    const selectedAvailability = this.availableDates.find(a => a.date === this.selectedDate);
  
    if (!selectedAvailability) {
      alert("Aucune disponibilité trouvée pour cette date.");
      return;
    }
  
    const appointment = {
      availability: { id: selectedAvailability.id }, // 🔹 Envoi uniquement l'ID de la disponibilité
      selectedSlot: this.selectedTime, // 🔹 Enregistrer le créneau exact
      status: 'CONFIRMED'
    };
  
    console.log("🔹 Envoi de l'appointment :", appointment); // Debug
  
    this.isLoading = true;
    this.appointmentService.createAppointment(appointment).subscribe(
      response => {
        console.log('✅ Rendez-vous confirmé :', response);
        alert(`Rendez-vous confirmé le ${this.selectedDate} à ${this.selectedTime}`);
        this.isLoading = false;
      },
      error => {
        console.error('❌ Erreur lors de la réservation :', error);
        alert('Erreur lors de la réservation.');
        this.isLoading = false;
      }
    );
  }
  
  
  // Fonction pour générer des créneaux horaires entre startTime et endTime
generateTimeSlots(startTime: string, endTime: string, interval: number = 30): string[] {
  const slots: string[] = [];
  let start = new Date(`1970-01-01T${startTime}`);
  const end = new Date(`1970-01-01T${endTime}`);

  while (start < end) {
    const next = new Date(start);
    next.setMinutes(start.getMinutes() + interval);
    
    if (next <= end) {
      slots.push(start.toTimeString().substring(0, 5) + " - " + next.toTimeString().substring(0, 5));
    }
    
    start = next;
  }
  return slots;
}

}
