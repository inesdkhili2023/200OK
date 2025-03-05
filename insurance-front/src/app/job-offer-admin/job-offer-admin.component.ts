import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { JobOfferDetailsComponent } from '../job-offer-details/job-offer-details.component';
import { JobOfferService } from '../services/job-offer.service';
import { AddJobComponent } from '../add-job/add-job.component';
import { MatTableDataSource } from '@angular/material/table';
import { JobOfferEditComponent } from '../job-offer-edit/job-offer-edit.component';

@Component({
  selector: 'app-job-offer-admin',
  templateUrl: './job-offer-admin.component.html',
  styleUrls: ['./job-offer-admin.component.css']
})
export class JobOfferAdminComponent implements AfterViewInit {

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  selectedJob: any = null;
  showForm: boolean = false;
  jobApplications: any[] = [];
  jobOffers: any[] = [];
  displayedColumns: string[] = ['title', 'description','location', 'contractType', 'deadline', 'action'];
  dataSource = new MatTableDataSource(this.jobOffers);
 


constructor(private jobOfferService: JobOfferService, public dialog: MatDialog) {}

ngAfterViewInit() {
  this.getJobOffers();
    // Link paginator and sort to the dataSource
}

  // Method to fetch job offers from the backend
  getJobOffers(): void {
    this.jobOfferService.getJobOffers().subscribe(
      (data) => {
        try {
          this.jobOffers = data;
          this.dataSource.data = this.jobOffers; 
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        } catch (error) {
          console.error('Error parsing job offers data:', error);
        }
      },
      (error) => {
        console.error('Error fetching job offers:', error);
      }
    );
  }
  
   // Appliquer un filtre
   applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;
  } 

openAddJobOfferDialog() {
  const dialogRef = this.dialog.open(AddJobComponent, {
    width: '60%',  // Largeur de 80% de l'écran
    height: '70%', // Hauteur de 80% de l'écran
    position: {
      top: '10%',  // Décale le dialog vers le bas (10% de l'écran depuis le haut)
      bottom:'10%'
    }
    
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
     // this.loadJobOffers(); // Recharger les offres après ajout
    }
  });
}
editJobOffer(jobOfferId: number) {
  console.log('Modification de l\'offre avec ID:', jobOfferId);

  const jobOffer = this.jobOffers.find(offer => offer.jobOfferId === jobOfferId);
  if (!jobOffer) {
    console.error("Offre introuvable !");
    return;
  }

  const dialogRef = this.dialog.open(JobOfferDetailsComponent, {
    width: '600px',
    data: jobOffer
  });

  dialogRef.afterClosed().subscribe(updatedJob => {
    if (updatedJob) {
      this.jobOfferService.updateJobOffer(updatedJob).subscribe(() => {
        this.getJobOffers(); // Rafraîchir la liste
      });
    }
  });
}

deleteJobOffer(jobOfferId: number) {
  console.log('Suppression de l\'offre avec ID:', jobOfferId);

  if (!jobOfferId) {
    console.error("Erreur : L'identifiant de l'offre est indéfini !");
    return;
  }

  if (confirm("Êtes-vous sûr de vouloir supprimer cette offre ?")) {
    this.jobOfferService.deleteJobOffer(jobOfferId).subscribe(() => {
      console.log("Offre supprimée avec succès !");
      this.getJobOffers(); // Rafraîchir la liste après suppression
    }, error => {
      console.error("Erreur lors de la suppression de l'offre :", error);
    });
  }
}
openJobOfferDialog(jobOffer: any): void {
  console.log('Opening dialog for job:', jobOffer); // Debugging log

  const dialogRef = this.dialog.open(JobOfferDetailsComponent, {
    width: '600px',
    data: jobOffer
  });

  dialogRef.afterClosed().subscribe(result => {
    console.log('Dialog fermé');
  });
}
openJobOfferEditDialog(job: any): void {
  const dialogRef = this.dialog.open(JobOfferEditComponent, {
    width: '700px',
    data: job
  });

  dialogRef.afterClosed().subscribe(updatedJob => {
    if (updatedJob) {
      // Find the edited job and update it in the array
      const index = this.jobOffers.findIndex(j => j.jobOfferId === updatedJob.jobOfferId);
      if (index !== -1) {
        this.jobOffers[index] = updatedJob;
      }
    }
  });
}
}





