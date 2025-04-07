import { Component, OnInit, ViewChild } from '@angular/core';
import { AgencyService } from 'src/app/services/agency.service';
import { Agency } from 'src/app/models/agency.model';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-agency-list',
  templateUrl: './agency-list.component.html',
  styleUrls: ['./agency-list.component.css']
})
export class AgencyListComponent implements OnInit {
  dataSource = new MatTableDataSource<Agency>([]);
  filteredDataSource: Agency[] = [];
  displayedColumns: string[] = ['id', 'name', 'location', 'contact', 'hours', 'actions'];
  isLoading = true;
  searchQuery = '';
  selectedAgency: Agency | null = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private agencyService: AgencyService, private router: Router) {}

  ngOnInit(): void {
    this.getAgencyList();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  updateAgency(idAgency?: number): void {
    if (idAgency) {
      this.router.navigate(['/admin/agency', { idAgency: idAgency }]);
    }
  }

  deleteAgency(idAgency?: number): void {
    if (!idAgency) return;
    
    if (confirm('Are you sure you want to delete this agency?')) {
      this.agencyService.deleteAgency(idAgency).subscribe(
        () => {
          this.getAgencyList();
        }
      );
    }
  }

  getAgencyList(): void {
    this.isLoading = true;
    this.agencyService.getAgencys().subscribe(
      (data: Agency[]) => {
        this.dataSource.data = data;
        this.filteredDataSource = data;
        this.isLoading = false;
      },
      (error: any) => {
        console.error('Error fetching agencies:', error);
        this.isLoading = false;
      }
    );
  }

  searchAgencies(): void {
    if (!this.searchQuery.trim()) {
      this.filteredDataSource = this.dataSource.data;
      return;
    }

    const query = this.searchQuery.toLowerCase().trim();
    this.filteredDataSource = this.dataSource.data.filter(agency => {
      return (
        agency.agencyName?.toLowerCase().includes(query) ||
        agency.location?.toLowerCase().includes(query) ||
        agency.telephone?.toString().toLowerCase().includes(query) ||
        agency.email?.toLowerCase().includes(query)
      );
    });
  }

  selectAgency(agency: Agency): void {
    this.selectedAgency = agency;
  }

  formatTime(time: string): string {
    if (!time) return 'N/A';
    
    try {
      // Handle different time formats, assuming time is in 24-hour format as string
      // Convert to a more readable format if needed
      if (time.includes(':')) {
        return time;
      } else if (time.length === 4) {
        // If time is like "0800", format it as "08:00"
        return `${time.slice(0, 2)}:${time.slice(2, 4)}`;
      }
      return time;
    } catch (error) {
      return time;
    }
  }

  getOpeningHours(agency: Agency): string {
    if (!agency.openingHour || !agency.closingHour) return 'Hours not available';
    return `${this.formatTime(agency.openingHour)} - ${this.formatTime(agency.closingHour)}`;
  }
}