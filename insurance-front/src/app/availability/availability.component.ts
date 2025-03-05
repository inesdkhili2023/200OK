import { Component } from '@angular/core';
import { AvailabilityService } from '../services/availability.service';

@Component({
  selector: 'app-availability',
  templateUrl: './availability.component.html',
  styleUrls: ['./availability.component.css']
})
export class AvailabilityComponent {
  isAgent: boolean = true; // Cette variable détermine si l'utilisateur est un agent
  availability: { date: string, startTime: string, endTime: string } = { date: '', startTime: '', endTime: '' };

  constructor(private availabilityService: AvailabilityService) {}

  submitAvailability(): void {
    this.availabilityService.addAvailability(this.availability).subscribe({
      next: () => {
        alert('✅ Disponibilité ajoutée avec succès !');
        this.availability = { date: '', startTime: '', endTime: '' }; // Réinitialisation du formulaire
      },
      error: (err) => {
        console.error('Erreur lors de l’ajout de la disponibilité :', err);
        alert('❌ Une erreur est survenue lors de l’ajout de la disponibilité.');
      }
    });
  }
}
