import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { JobApplicationService } from '../services/job-application.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { HttpClient } from '@angular/common/http';
import { JobOfferService } from '../services/job-offer.service';
@Component({
  selector: 'app-job-app-admin',
  templateUrl: './job-app-admin.component.html',
  styleUrls: ['./job-app-admin.component.css'],
})
export class JobAppAdminComponent implements OnInit {
  selectedStatus: string = '';
selectedDate: Date | null = null;
  jobApplications: any[] = [];
  displayedColumns: string[] = [
    'firstName',
    'lastName',
    'email',
    'phone',
    'appliedAt',
    'resume',
    'applicationStatus',
    'actions',
  ];
  dataSource = new MatTableDataSource<any>([]);
  statusList = [
    { value: 'ON_HOLD', label: 'En attente' },
    { value: 'ACCEPTED', label: 'Accepté' },
    { value: 'REFUSED', label: 'Refusé' }
  ];
    
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor(
    private jobApplicationService: JobApplicationService,
    private jobOfferService:JobOfferService,
    public dialog: MatDialog,
    private http: HttpClient
  ) {}
  ngOnInit(): void {
    this.getJobApplications();
  }

  getJobApplications(): void {
    this.jobApplicationService.getJobApplications().subscribe(
      (data) => {
        this.jobApplications = data.map(application => ({
          ...application,
          jobTitle: application.jobOffer?.title || 'Non spécifié' // 🔹 Utilise le `jobOffer`
        }));
  
        this.dataSource = new MatTableDataSource(this.jobApplications);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      (error) => {
        console.error('Erreur lors de la récupération des candidatures', error);
      }
    );
  }
  

  // Appliquer un filtre recherche
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  // Afficher les détails d'une candidature
  viewApplication(application: any): void {
    alert(
      `Candidat: ${application.firstName} ${application.lastName}\nEmail: ${application.email}`
    );
  }
  openResume(resumePath: string): void {
    if (!resumePath) {
      alert("Aucun CV disponible pour cette candidature.");
      return;
    }
  
    // Vérifier si le chemin commence par "http://" ou "https://" sinon ajouter l'URL du backend
    const fileUrl = `http://localhost:8081/uploads/${encodeURIComponent(resumePath)}`;
    console.log("Opening file:", fileUrl);
    window.open((fileUrl), '_blank');

  }
  
  

  // Supprimer une candidature
  deleteApplication(applicationId: number): void {
    if (confirm('Voulez-vous vraiment supprimer cette candidature ?')) {
      this.jobApplicationService.deleteJobApplication(applicationId).subscribe(
        () => {
          console.log('Candidature supprimée avec succès');
          this.getJobApplications(); // Recharger la liste après suppression
        },
        (error) => {
          console.error(
            'Erreur lors de la suppression de la candidature',
            error
          );
        }
      );
    }
  }
  updateApplicationStatus(applicationId: number, newStatus: string): void {
    // Vérifie si l'applicationId est bien défini
    if (!applicationId || !newStatus) {
      console.warn("ID ou statut invalide pour la mise à jour");
      return;
    }
  
    this.jobApplicationService.updateJobApplicationStatus(applicationId, newStatus).subscribe(
      () => {
        console.log(`Statut mis à jour : ${newStatus}`);
        this.getJobApplications(); // Recharge la liste après mise à jour
      },
      (error) => {
        console.error("Erreur lors de la mise à jour du statut", error);
      }
    );
  }

  applyFilter2() {
    let filteredData = this.jobApplications;
  
   
  
    // Filtre par statut
    if (this.selectedStatus) {
      filteredData = filteredData.filter(application => application.applicationStatus === this.selectedStatus);
    }
  
    // Filtre par date de candidature
    if (this.selectedDate) {
      const selectedDateString = this.selectedDate.toISOString().split('T')[0]; // Format YYYY-MM-DD
      filteredData = filteredData.filter(application =>
        application.appliedAt.split('T')[0] === selectedDateString
      );
    }
  
    this.dataSource.data = filteredData; // Mettre à jour la table
  }
  sortApplications(order: string) {
    this.dataSource.data.sort((a, b) => {
      const dateA = new Date(a.appliedAt).getTime();
      const dateB = new Date(b.appliedAt).getTime();
  
      return order === 'recent' ? dateB - dateA : dateA - dateB;
    });
  
    this.updatePaginatedApplications();
  }
  updatePaginatedApplications() {
    this.dataSource._updateChangeSubscription(); // Force la mise à jour du tableau
  }
  voirCV(filePath: string) {
    // Extraire le nom du fichier
    const fileName = this.extraireNomFichier(filePath);
  
    console.log("Nom du fichier :", fileName); // Vérifier la valeur
    if (!fileName) {
      alert("Le fichier CV est introuvable !");
      return;
    }
    window.open(`http://localhost:8081/jobapplications/files/${fileName}`, '_blank');
  }
  // Fonction pour extraire le nom du fichier sans fakepath
extraireNomFichier(filePath: string): string {
  const index = filePath.lastIndexOf('\\'); // Cherche le dernier '\'
  if (index === -1) {
    return filePath; // Si il n'y a pas de fakepath, retourne le chemin complet
  }
  return filePath.substring(index + 1); // Retourne juste le nom du fichier après le dernier '\'
}

getStatusClass(status: string): string {
  switch (status) {
    case 'ACCEPTED':
      return 'status-accepted';
    case 'ON_HOLD':
      return 'status-on-hold';
    case 'REFUSED':
      return 'status-refused';
    default:
      return '';
  }
}

getStatusLabel(status: string): string {
  switch (status) {
    case 'ACCEPTED':
      return 'Accepté';
    case 'ON_HOLD':
      return 'En attente';
    case 'REFUSED':
      return 'Refusé';
    default:
      return status;
  }
}

}

  

