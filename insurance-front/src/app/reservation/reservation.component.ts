import { Component, OnInit } from '@angular/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { AppointmentService } from '../services/appointment.service';
import { AvailabilityService } from '../services/availability.service';
import { GoogleCalendarService } from '../services/googleCalendar.service';
import { MatSnackBar } from '@angular/material/snack-bar';
declare var gapi: any;

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
  availableDates: { id:number,date: string, startTime: string, endTime: string ,status:string}[] = [];
  selectedSlotIndex: number | null = null;  // Garder l'index du créneau sélectionné
  confirmedSlots: string[] = [];
  confirmedDates: string[] = [];

  calendarOptions: any = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin, interactionPlugin],
    dateClick: this.onDateClick.bind(this),
    events: []
  };

  constructor(
    private appointmentService: AppointmentService,
    private availabilityService: AvailabilityService,
    private googleCalendarService:GoogleCalendarService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadAvailabilities();
    this.loadConfirmedAppointments();
    if (typeof gapi !== 'undefined') {
      gapi.load('client:auth2', () => {
        this.googleCalendarService.initClient();
      });
    } else {
      console.error("gapi n'est pas encore chargé. Vérifiez que Google API est bien inclus dans `index.html`.");
    }

  }
  showNotification(message: string, action: string = 'Fermer') {
    this.snackBar.open(message, action, {
      duration: 3000 // 3 secondes
    });
  }
  // Méthodes helper pour les notifications
private showErrorNotification(message: string) {
  this.snackBar.open(message, 'Fermer', {
    duration: 5000,
    panelClass: ['error-snackbar'],
    horizontalPosition: 'center',
    verticalPosition: 'top'
  });
}

private showWarningNotification(message: string) {
  this.snackBar.open(message, 'Fermer', {
    duration: 4000,
    panelClass: ['warning-snackbar'],
    horizontalPosition: 'center',
    verticalPosition: 'top'
  });
}

// Optionnel: Ajoutez aussi pour les succès si besoin
private showSuccessNotification(message: string) {
  this.snackBar.open(message, 'OK', {
    duration: 3000,
    panelClass: ['success-snackbar'],
    horizontalPosition: 'center',
    verticalPosition: 'top'
  });
}
  loadAvailabilities() {
    this.availabilityService.getAvailabilities().subscribe(
      (availabilities: any[]) => { // Ici on reçoit bien les données de l'API
        this.availableDates = availabilities
        .map(a => ({
          id: a.id,  // 🔹 Assurer que l'id est présent
          date: a.date,
          startTime: a.startTime, 
          endTime: a.endTime,
          status: a.status
        }));
        console.log(this.availableDates);  // Vérifiez ici les données retournées par l'API
        this.updateCalendarEvents(this.availableDates);

        
      },
      (error) => {
        console.error('Erreur lors du chargement des disponibilités :', error);
      }
      
    );
    
  }
  

  onDateClick(info: any) {
    const availability = this.availableDates.find(a => a.date === info.dateStr);
    if (availability) {
      if (availability.status.toUpperCase() === 'CANCELLED') {
        alert("❌ Cette disponibilité est annulée. Vous ne pouvez plus réserver.");
        this.selectedDate = '';
        this.availableTimes = [];
        return;
      }
  
      this.selectedDate = info.dateStr;
      this.availableTimes = this.generateTimeSlots(availability.startTime, availability.endTime);
      this.loadConfirmedAppointments();
    } else {
      this.selectedDate = '';
      this.availableTimes = [];
      alert("Aucune disponibilité pour cette date.");
    }
  }
  
  
  

  onTimeSelect(time: string) {
    this.selectedTime = time;
    this.selectedSlotIndex = this.availableTimes.indexOf(time);

  }

  confirmReservation() {
    if (!this.selectedDate || !this.selectedTime) {
      alert('Veuillez sélectionner une date et une heure.');
      return;
    }
  // Vérification que la date sélectionnée est dans le futur
  const selectedDateObj = new Date(this.selectedDate);
  const currentDate = new Date();

  if (selectedDateObj < currentDate) {
      alert("La date sélectionnée est dans le passé. Veuillez sélectionner une date future.");
      return;
  }
    const selectedAvailability = this.availableDates.find(a => a.date === this.selectedDate);
    if (!selectedAvailability) {
      alert("Aucune disponibilité trouvée pour cette date.");
      return;
    }
    console.log("🔹 Disponibilité sélectionnée : ", selectedAvailability);  // Vérifiez ici la disponibilité

    const appointment = {
      availability: { id: selectedAvailability.id },
      selectedSlot: this.selectedTime.split(" - ")[0],
      status: 'CONFIRMED'
    };
  
    console.log("🔹 Envoi de l'appointment :", appointment);
  
    this.isLoading = true;
    this.appointmentService.createAppointment(appointment).subscribe(
      response => {
        console.log('✅ Rendez-vous confirmé :', response);
        alert(`✅ Rendez-vous confirmé :\n📅 Date : ${this.selectedDate}\n🕒 Heure : ${this.selectedTime}`);
        // Now create the event in Google Calendar
        this.addToGoogleCalendar(appointment);
    // Add the selected slot to the confirmedSlots array
    const startTime = this.selectedTime.split(" - ")[0];
    this.confirmedSlots.push(startTime);
        // Add the selected slot to the confirmedSlots array
        this.confirmedSlots.push(this.selectedTime);
  
        // Optionally, update the confirmed dates and slots here
        this.loadConfirmedAppointments();
        
        // Clear selected date and time after confirmation
        this.selectedDate = '';
        this.selectedTime = '';
        this.isLoading = false;
      },
      error => {
        console.error('❌ Erreur lors de la réservation :', error);
        alert('❌ Une erreur est survenue lors de la réservation.');
        this.isLoading = false;
      }
    );
  }


  signIn(): void {
    const authInstance = gapi.auth2.getAuthInstance();
  
    authInstance.signIn().then(
      (user: any) => {
        console.log('Utilisateur connecté:', user);
        // Si l'utilisateur est connecté, appelle la méthode pour ajouter un événement au calendrier
        this.addToGoogleCalendar(user);
      },
      (error: any) => {
        // Gérer l'erreur si la fenêtre est fermée ou s'il y a une autre erreur
        if (error.error === 'popup_closed_by_user') {
          console.warn('L\'utilisateur a fermé la fenêtre de connexion.');
        } else {
          console.error('Erreur d\'authentification : ', error);
        }
      }
    );
  }
  

  signOut(): void {
    this.googleCalendarService.signOut();
  }
  // Méthode pour ajouter le rendez-vous à Google Calendar
async addToGoogleCalendar(appointment: any) {
  try {
    const authInstance = gapi.auth2.getAuthInstance();

    if (!authInstance.isSignedIn.get()) {
      console.warn("L'utilisateur n'est pas connecté. Connexion en cours...");
      await authInstance.signIn();  // 🔹 Demande à l'utilisateur de se connecter si nécessaire
    }

    const event = {
      summary: `Rendez-vous`,
      location: 'Lieu du rendez-vous',
      description: 'Détails du rendez-vous',
      start: {
        dateTime: `${appointment.selectedDate}T${appointment.selectedSlot}:00`,
        timeZone: 'Europe/Paris',
      },
      end: {
        dateTime: `${appointment.selectedDate}T${appointment.selectedSlot}:30`,
        timeZone: 'Europe/Paris',
      },
      attendees: [{ email: 'malekfeki18@gmail.com' }], // Remplacer par l'email de l'utilisateur
    };

    const response = await this.googleCalendarService.createEvent(event);
    console.log('✅ Événement ajouté à Google Calendar:', response);
  } catch (error) {
    console.error('❌ Erreur lors de l’ajout à Google Calendar:', error);
  }
}

updateCalendarEvents(data: any[]): void {
  this.calendarOptions = {
    ...this.calendarOptions,
    events: data.map(a => ({
      title: a.status.toUpperCase() === 'CANCELLED' ? '❌ Annulé' : '📅 Dispo',
      date: a.date,
      color: a.status.toUpperCase() === 'CANCELLED' ? 'red' : 'green',
      allDay: true
    }))
  };
   // 🔹 Forcer la mise à jour avec setTimeout()
   setTimeout(() => {
    this.calendarOptions = { ...this.calendarOptions };
    console.log("✅ Calendrier mis à jour !");
  }, 100);
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


isSlotDisabled(slot: string): boolean {
  // Extract the start time from the slot (e.g., "09:00 - 09:30" -> "09:00")
  const startTime = slot.split(" - ")[0];
  
  // Check if this start time is in the confirmedSlots array
  return this.confirmedSlots.includes(startTime);
}


isSlotSelected(index: number): boolean {
  return this.selectedSlotIndex === index;
}
loadConfirmedAppointments() {
  this.appointmentService.getAppointments().subscribe(
    (appointments: any[]) => {
      // Clear the arrays to avoid duplication
      this.confirmedDates = [];
      this.confirmedSlots = [];

      // Populate the confirmed dates and slots arrays
      appointments.forEach((appointment) => {
        this.confirmedDates.push(appointment.availability.date);
        // Make sure we're storing just the start time
        this.confirmedSlots.push(appointment.selectedSlot);
      });
      console.log("Confirmed Slots: ", this.confirmedSlots);
      console.log("Confirmed Dates: ", this.confirmedDates);
    },
    (error) => {
      console.error('Erreur lors du chargement des rendez-vous confirmés :', error);
    }
  );
}

}
