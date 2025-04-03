import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { AvailabilityService } from '../services/availability.service';

@Component({
  selector: 'app-availability-admin',
  templateUrl: './availability-admin.component.html',
  styleUrls: ['./availability-admin.component.css']
})
export class AvailabilityAdminComponent implements OnInit {
  displayedColumns: string[] = ['date', 'startTime', 'endTime', 'status', 'action'];
  dataSource = new MatTableDataSource<any>([]);
  filteredDataSource = new MatTableDataSource<any>([]);
  selectedStatus: string="";  // This will store the selected status filter
  searchQuery: string = ''; // This will store the text input for search
  selectedAvailability: any | null = null;
  statusList = [
    { value: 'AVAILABLE', label: 'Disponible' },
    { value: 'BOOKED', label: 'Réservé' },
    { value: 'CANCELLED', label: 'Annulé' }
  ];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private availabilityService: AvailabilityService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadAvailabilities();
  }

  loadAvailabilities(): void {
    this.availabilityService.getAvailabilities().subscribe((data) => {
      this.dataSource.data = data;
      this.filteredDataSource.data = data;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.applyStatusFilter();  // Reapply status filter after search filter

  }

 

  openEditAvailabilityDialog(availability: any): void {
    // Open a dialog to edit an availability
  }

  deleteAvailability(id: number): void {
    this.availabilityService.deleteAppointment(id).subscribe(() => {
      this.loadAvailabilities();
    });
  }

  selectAvailability(availability: any): void {
    this.selectedAvailability = availability;
  }
  getStatusClass(status: string): string {
    switch (status) {
      case 'AVAILABLE': return 'status-available';
      case 'BOOKED': return 'status-booked';
      case 'CANCELLED': return 'status-cancelled';
      default: return '';
    }
  }

  getStatusLabel(status: string): string {
    return this.statusList.find(s => s.value === status)?.label || status;
  }
  updateAvailabilityStatus(id: number, newStatus: string): void {
    this.availabilityService.updateStatus(id, newStatus).subscribe(() => {
      const availability = this.dataSource.data.find(a => a.id === id);
      if (availability) {
        availability.status = newStatus;
      }
      this.applyStatusFilter(); // Appliquer le filtre après mise à jour

    });
  }
  // Apply the status filter
  applyStatusFilter(): void {
    // If a status is selected, make an API call to get filtered data
    if (this.selectedStatus) {
      this.availabilityService.getAvailabilitiesByStatus(this.selectedStatus).subscribe((data) => {
        this.dataSource.data = data;  // Update dataSource with the filtered data
      });
    } else {
      this.loadAvailabilities();  // If no status is selected, reload all availabilities
    }
  }
  
}
