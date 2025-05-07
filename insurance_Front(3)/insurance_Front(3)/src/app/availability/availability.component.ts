import { Component, OnInit } from '@angular/core';
import { AvailabilityService } from '../services/availability.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-availability',
  templateUrl: './availability.component.html',
  styleUrls: ['./availability.component.css']
})
export class AvailabilityComponent implements OnInit{
  isAgent: boolean = true; // Cette variable détermine si l'utilisateur est un agent
  availability: { date: string, startTime: string, endTime: string } = { date: '', startTime: '', endTime: '' };
  availabilities: any[] = []; // Tableau pour stocker les disponibilités
  constructor(private availabilityService: AvailabilityService,
    private snackBar: MatSnackBar) {}
  ngOnInit(): void {
    // Récupérer toutes les disponibilités
    this.availabilityService.getAvailabilities().subscribe(
      (data) => {
        this.availabilities = data;
        console.log('Disponibilités récupérées:', this.availabilities);
      },
      (error) => {
        console.error('Erreur lors de la récupération des disponibilités:', error);
        this.snackBar.open('Erreur lors du chargement des disponibilités', 'Fermer', { duration: 3000 });

      }
    );
  }
  submitAvailability(): void {
    // Vérifier si une disponibilité existe déjà pour la même date
    const existingAvailability = this.availabilities.find(
      (availability) => availability.date === this.availability.date
    );
  
    if (existingAvailability) {
      // Si une disponibilité existe pour cette date, afficher un message d'erreur
      this.snackBar.open(`Une disponibilité existe déjà pour la date : ${this.availability.date}`, 'Fermer', {
        duration: 4000,
        panelClass: ['snack-error']
      });      
    } else {
      // Si aucune disponibilité n'existe pour cette date, soumettre le formulaire
      this.availabilityService.addAvailability(this.availability).subscribe(
        (response) => {
          console.log('Disponibilité ajoutée avec succès:', response);
          this.snackBar.open('Disponibilité ajoutée avec succès !', 'OK', {
            duration: 4000,
            panelClass: ['snack-success']
          });          // Vous pouvez rediriger l'utilisateur ou réinitialiser le formulaire ici
          this.availability.date = '';
          this.availability.startTime = '';
          this.availability.endTime = '';
        },
        (error) => {
          console.error('Erreur lors de l\'ajout de la disponibilité:', error);
          this.snackBar.open('Erreur lors de l\'ajout de la disponibilité', 'Fermer', {
            duration: 4000,
            panelClass: ['snack-error']
          });        }
      );
    }
  }
  
}
