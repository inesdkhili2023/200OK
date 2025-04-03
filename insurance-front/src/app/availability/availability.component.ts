import { Component, OnInit } from '@angular/core';
import { AvailabilityService } from '../services/availability.service';

@Component({
  selector: 'app-availability',
  templateUrl: './availability.component.html',
  styleUrls: ['./availability.component.css']
})
export class AvailabilityComponent implements OnInit{
  isAgent: boolean = true; // Cette variable détermine si l'utilisateur est un agent
  availability: { date: string, startTime: string, endTime: string } = { date: '', startTime: '', endTime: '' };
  availabilities: any[] = []; // Tableau pour stocker les disponibilités
  constructor(private availabilityService: AvailabilityService) {}
  ngOnInit(): void {
    // Récupérer toutes les disponibilités
    this.availabilityService.getAvailabilities().subscribe(
      (data) => {
        this.availabilities = data;
        console.log('Disponibilités récupérées:', this.availabilities);
      },
      (error) => {
        console.error('Erreur lors de la récupération des disponibilités:', error);
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
      alert(`Il existe déjà une disponibilité pour cette date: ${this.availability.date}`);
      
    } else {
      // Si aucune disponibilité n'existe pour cette date, soumettre le formulaire
      this.availabilityService.addAvailability(this.availability).subscribe(
        (response) => {
          console.log('Disponibilité ajoutée avec succès:', response);
          alert('Disponibilité ajoutée au calendrier avec succès');
          // Vous pouvez rediriger l'utilisateur ou réinitialiser le formulaire ici
          this.availability.date = '';
          this.availability.startTime = '';
          this.availability.endTime = '';
        },
        (error) => {
          console.error('Erreur lors de l\'ajout de la disponibilité:', error);
           alert('Une erreur est survenue lors de l\'ajout de la disponibilité.');
        }
      );
    }
  }
  
}
