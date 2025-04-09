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
  filteredDataSource: Agency[] = [];
  dataSource = new MatTableDataSource<Agency>();
  displayedColumns: string[] = ['idAgency', 'latitude', 'longitude', 'agencyName', 'location', 'telephone', 'actions'];
  searchQuery = '';
  isLoading = true;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private agencyService: AgencyService, private router: Router) {}

  ngOnInit(): void {
    this.getAgencyList();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  updateAgency(idAgency: number): void {
    this.router.navigate(['/agency', { idAgency: idAgency }]);
  }

  deleteAgency(idAgency: number): void {
    this.agencyService.deleteAgency(idAgency).subscribe({
      next: (res) => {
        console.log(res);
        this.getAgencyList();
      },
      error: (err: HttpErrorResponse) => {
        console.log(err);
      }
    });
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


}