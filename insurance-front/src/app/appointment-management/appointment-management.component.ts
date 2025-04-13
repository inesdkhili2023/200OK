import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AppointmentService } from '../services/appointment.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-appointment-management',
  templateUrl: './appointment-management.component.html',
  styleUrls: ['./appointment-management.component.css']
})
export class AppointmentManagementComponent implements AfterViewInit {
  // Data for the table
  dataSource = new MatTableDataSource<any>([]);
  displayedColumns: string[] = ['clientName', 'date', 'time','remainingTime', 'status', 'action'];
  selectedStatus!: string;  // To hold selected status
  searchQuery: string = ''; // To hold search query

  statusList = [
    { value: 'CONFIRMED', label: 'Confirmé' },
    { value: 'CANCELED', label: 'Annulé' },
    { value: 'COMPLETED', label: 'Terminé' }
  ];
  statusCounts: any = {}; // Object to store the count of appointments per status
  totalAppointments: number = 0; // Store total number of appointments
  // The appointment object is not needed globally, will be used in a dialog or form if required
  appointment = {
    id: 1,
    availability: null, // Populate this with actual availability data
    status: 'CONFIRMED'
  };

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  private timer: any; // For managing the dynamic timer update

  constructor(private appointmentService: AppointmentService, private snackBar:MatSnackBar) { }

  ngOnInit(): void {
    this.loadAppointments();
    this.startTimer();
  }
  ngOnDestroy(): void {
    // Cleanup the interval when the component is destroyed
    if (this.timer) {
      clearInterval(this.timer);
    }
  }
  startTimer(): void {
    this.timer = setInterval(() => {
      // Force refresh of the remaining time by re-calculating it for each appointment
      this.dataSource.data = [...this.dataSource.data];
    }, 60000); // Update every minute
  }
  ngAfterViewInit() {
    // Ensure that the paginator and sorter are properly initialized after the view is initialized
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadAppointments(): void {
    this.appointmentService.getAppointments().subscribe(appointments => {
      // Map the response data if necessary (this depends on the structure of your response)
      this.dataSource.data = appointments;
      console.log(this.dataSource);
      this.calculateStatusCounts();
    });
  }
  applySearchFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  applyStatusFilter(): void {
    if (this.selectedStatus) {
      this.dataSource.data = this.dataSource.data.filter(item => item.status === this.selectedStatus);
    } else {
      this.loadAppointments(); // Reset to original data if no status is selected
    }
  }

  deleteAppointment(id: any): void {
    this.appointmentService.deleteAppointment(id).subscribe(
      () => {
        // Mise à jour du tableau affiché
        this.dataSource.data = this.dataSource.data.filter(app => app.id !== id);
  
        // Affichage de la confirmation
        this.snackBar.open('Rendez-vous supprimé avec succès', 'Fermer', {
          duration: 3000,
          panelClass: ['snack-success']
        });
  
        // Recalcul des stats
        this.calculateStatusCounts();
      },
      (error) => {
        console.error('Erreur lors de la suppression du rendez-vous:', error);
        this.snackBar.open('Erreur lors de la suppression du rendez-vous', 'Fermer', {
          duration: 3000,
          panelClass: ['snack-error']
        });
      }
    );
  }
  
  
  
  updateAppointmentStatus(id: number, newStatus: string): void {
    this.appointmentService.updateAppointmentStatus(id, newStatus).subscribe(
      () => {
        const appointment = this.dataSource.data.find(a => a.id === id);
        if (appointment) {
          appointment.status = newStatus;
        }
        // Recalculate the status counts after updating the status
      this.calculateStatusCounts();
      },
      (error) => console.error('Erreur lors de la mise à jour du statut:', error)
    );
  }
  calculateStatusCounts(): void {
    // Réinitialisation des compteurs de statut
    this.statusCounts = { 'CANCELED': 0, 'COMPLETED': 0, 'CONFIRMED': 0 };
  
    // Compte des rendez-vous par statut à partir de la source de données
    this.dataSource.data.forEach(appointment => {
      if (this.statusCounts[appointment.status] !== undefined) {
        this.statusCounts[appointment.status]++;
      }
    });
  
    // Mettre à jour le total des rendez-vous
    this.totalAppointments = this.dataSource.data.length;
  }
  
  
  onCreateAppointment(): void {
    this.appointmentService.createAppointment(this.appointment).subscribe(
      (response) => {
        console.log('Appointment created successfully', response);
        // Reload the appointments after a new one is created
        this.loadAppointments();
      },
      (error) => {
        console.error('There was an error creating the appointment', error);
      }
    );
  }
  formatDate(dateString: string): string {
    if (!dateString) return ''; // Vérification pour éviter les erreurs
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  }
  selectedRowIndex: number | null = null;

onRowClick(row: any) {
  console.log('Selected row:', row);
  this.selectedRowIndex = row.id;
}

  getStatusClass(status: string): string {
    switch (status) {
      case 'CONFIRMED': return 'status-confirmed';
      case 'CANCELED': return 'status-canceled';
      case 'COMPLETED': return 'status-completed';
      default: return '';
    }
  }
  
  getStatusLabel(status: string): string {
    const statusLabels: { [key: string]: string } = {
      'CONFIRMED': 'Confirmé',
      'CANCELED': 'Annulé',
      'COMPLETED': 'Terminé'
    };
    return statusLabels[status] || status;
  }
  
  getRemainingTime(appointmentDate: string): string {
    const appointmentTime = new Date(appointmentDate).getTime();
    const currentTime = new Date().getTime();
    const remainingTime = appointmentTime - currentTime;
  
    if (remainingTime <= 0) {
      return 'Rendez-vous passé';
    }
  
    const remainingDays = Math.ceil(remainingTime / (1000 * 60 * 60 * 24)); // Convert to days
  
    return `${remainingDays} jour${remainingDays > 1 ? 's' : ''} restant${remainingDays > 1 ? 's' : ''}`;
  }
  
  
}
