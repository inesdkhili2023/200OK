import { AfterViewInit, Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { JobOfferDetailsComponent } from '../job-offer-details/job-offer-details.component';
import { JobOfferService } from '../services/job-offer.service';
import { ActivatedRoute } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
@Component({
  selector: 'app-joboffer',
  templateUrl: './job-offer.component.html',
  styleUrls: ['./job-offer.component.css']
})
export class JobOfferComponent implements OnInit{

  @Output() jobSelected = new EventEmitter<number>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  @ViewChild(MatSort) sort!: MatSort;
  pageSize = 6; // Number of cards per page
  pageIndex = 0; // Current page index
  jobApplications: [] = [];

  selectJob(jobId: number) {
    console.log("Job sélectionné avec ID:", jobId);
    this.jobSelected.emit(jobId);
  }
  selectedJob: any ;
  showForm: boolean = false;
  jobOffers: any[] = []; // Full list of job offers
  paginatedJobOffers: any[] = []; // Only the offers for the current page
  displayedColumns: string[] = ['title', 'location', 'contractType', 'deadline', 'action'];
dataSource = this.jobOffers;

  constructor(public dialog: MatDialog,private jobOfferService: JobOfferService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    
    this.loadJobOffers(); // Récupérer les offres d'emploi au démarrage

      const jobId = this.route.snapshot.paramMap.get('id'); // Récupérer l'ID depuis l'URL
      if (jobId) {
        this.jobOfferService.getJobById(jobId).subscribe(
          (job) => {
            this.selectedJob = job;
            console.log('Détails du job:', this.selectedJob);
          },
          (error) => {
            console.error('Erreur lors de la récupération du job:', error);
          }
        );
      }
  }
  ngAfterViewInit(): void {
    this.paginator.page.subscribe(() => {
      this.updatePaginatedJobOffers();
    });
  } 
    
  
  loadJobOffers(): void {
    this.jobOfferService.getJobOffers().subscribe((data) => {
      this.jobOffers = data;
      this.updatePaginatedJobOffers(); // Apply pagination initially
      this.sortJobs('recent');

    }, error => {
      console.error("Erreur lors du chargement des offres :", error);
    });
  }
  updatePaginatedJobOffers(): void {
    const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
    const endIndex = startIndex + this.paginator.pageSize;
    this.paginatedJobOffers = this.jobOffers.slice(startIndex, endIndex);
  }

  openForm(job: any) {
    this.selectedJob = job;
    this.showForm = true;
  }

  closeForm() {
    this.showForm = false;
    this.selectedJob = null;
  }
  openJobOfferDialog(jobOffer: any): void {
    const dialogRef = this.dialog.open(JobOfferDetailsComponent, {
      width: '600px',
      data: jobOffer
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog fermé');
    });
  }

  sortJobs(order: string) {
    this.jobOffers.sort((a, b) => {
      const dateA = new Date(a.applicationDeadline).getTime();
      const dateB = new Date(b.applicationDeadline).getTime();

      return order === 'recent' ? dateB - dateA : dateA - dateB;
    });

    this.updatePaginatedJobOffers();
  }
 
  

  
  
  
  
  
  
  
}
