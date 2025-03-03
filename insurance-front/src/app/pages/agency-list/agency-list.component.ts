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

  dataSource = new MatTableDataSource<Agency>();
  displayedColumns: string[] = ['idAgency', 'latitude', 'longitude', 'agencyName', 'location', 'telephone', 'actions'];

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
    this.agencyService.getAgencys().subscribe({
      next: (res: Agency[]) => {
        this.dataSource.data = res;
      },
      error: (err: HttpErrorResponse) => {
        console.log(err);
      }
    });
  }
}