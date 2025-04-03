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
    'compatibilityScore',
    'applicationStatus',
    'actions',
  ];
  dataSource = new MatTableDataSource<any>([]);
  statusList = [
    { value: 'ON_HOLD', label: 'En attente' },
    { value: 'ACCEPTED', label: 'Accepté' },
    { value: 'REFUSED', label: 'Refusé' }
  ];
    
  statusCounts: any = {}; // Object to store the count of applications per status
  totalApplications: number = 0; // Store total number of applications
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
        this.totalApplications = this.jobApplications.length;
        this.calculateStatusCounts(); 
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
    if (!applicationId || !newStatus) {
      console.warn("ID ou statut invalide pour la mise à jour");
      return;
    }
  
    // Mettre à jour le statut de la candidature
    this.jobApplicationService.updateJobApplicationStatus(applicationId, newStatus).subscribe(
      () => {
        console.log(`Statut mis à jour : ${newStatus}`);
  
        // Trouver et mettre à jour le statut dans la liste des candidatures
        const application = this.jobApplications.find(app => app.jobApplicationId === applicationId);
        if (application) {
          application.applicationStatus = newStatus;  // Mise à jour du statut
        }
  
        // Recalculer les statistiques directement après la mise à jour
        this.calculateStatusCounts(); 
        
        // Mettre à jour la source des données pour refléter les modifications
        this.dataSource.data = [...this.jobApplications];  // Important pour que la table se mette à jour
  
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
calculateStatusCounts(): void {
  // Réinitialisation des compteurs de statut
  this.statusCounts = { 'ON_HOLD': 0, 'ACCEPTED': 0, 'REFUSED': 0 };

  // Compte des candidatures par statut
  this.jobApplications.forEach(application => {
    if (this.statusCounts[application.applicationStatus] !== undefined) {
      this.statusCounts[application.applicationStatus]++;
    }
  });

  // Mettre à jour le total des candidatures
  this.totalApplications = this.jobApplications.length;
}
calculateCompatibilityScore(jobOffer: any, jobApplication: any): number {
  let score = 0;
  const totalWeight = 100;

  const safeToLowerCase = (value: string) => (value ? value.toLowerCase() : '');

  // Compétences et Langues (25%)
  if (jobApplication?.specialiteEtude && jobOffer?.requirements) {
    if (jobApplication.specialiteEtude.toLowerCase().includes(jobOffer.requirements.toLowerCase())) {
      score += 12.5; // Compétences
    }
  }

  // Langues (25%) - Basé uniquement sur les langues de la candidature
  if (jobApplication?.languages) {
    const applicationLanguages = jobApplication.languages.split(',').map((lang: string) => lang.trim().toLowerCase()); // Array of languages from the application

    // Add 5 points for each language mentioned in the application
    score += applicationLanguages.length * 5;
  }

  // Correspondance de la localisation (15%)
  if (jobApplication?.ville && jobOffer?.location) {
    if (safeToLowerCase(jobApplication.ville) === safeToLowerCase(jobOffer.location)) {
      score += 15;  // 15 points if the city matches
    }
  }

  // Type de contrat (15%)
  if (jobApplication?.typePoste && jobOffer?.contractType) {
    if (safeToLowerCase(jobApplication.typePoste) === safeToLowerCase(jobOffer.contractType)) {
      score += 15;  // 15 points if contract type matches
    }
  }

  // Lettre de motivation (15%) - If a cover letter exists, add 15 points
  if (jobApplication?.lettreMotivation) {
    score += 15;
  }

  // Disponibilité immédiate (30 points si "oui") - Add 30 points if availability is "1"
  if (jobApplication.disponibilite === '1') {
    score += 30;  // 30 points if the candidate is available immediately
  }

  // Resume (10 points if it exists)
  if (jobApplication.resume) {
    score += 10;  // Add 10 points if resume exists
  }

  // Niveau d'expérience (5% - 15%)
  if (jobApplication?.niveauExperience) {
    switch (jobApplication.niveauExperience) {
      case 'Débutant':
        score += 10;  // 5 points for 'Débutant'
        break;
      case 'Intermédiaire':
        score += 15;  // 10 points for 'Intermédiaire'
        break;
      case 'Expert':
        score += 20;  // 15 points for 'Expert'
        break;
      default:
        break;
    }
  }

  // Ajouter 5 points si commentaire existe
  if (jobApplication?.commentaire) {
    score += 10;
  }

  // Niveau d’études (15%) - Add points based on education level
  if (jobApplication?.niveauEtudes) {
    switch (jobApplication.niveauEtudes) {
      case 'Bac':
        score += 5;  // 5 points for 'Bac'
        break;
      case 'Licence':
        score += 10;  // 10 points for 'Licence'
        break;
      case 'Master':
        score += 15;  // 15 points for 'Master'
        break;
      case 'Doctorat':
        score += 20;  // 20 points for 'Doctorat'
        break;
      default:
        break;
    }
  }

  // Final calculation of the score based on total weight
  return Math.round((score / totalWeight) * totalWeight);  // Ensure the score is properly calculated
}



  
}
  

