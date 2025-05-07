import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PackModalComponentComponent } from '../pack-modal-component/pack-modal-component.component';

interface InsurancePack {
  name: string;
  description: string;
  price: number;
  greenPrice: number;
  garanties: {
    title: string;
    limit: string;
  }[];
}
@Component({
  selector: 'app-assurance-habitation-form',
  templateUrl: './assurance-habitation-form.component.html',
  styleUrls: ['./assurance-habitation-form.component.css']
})
export class AssuranceHabitationFormComponent {
  packs: InsurancePack[] = [
    {
      name: 'FELL',
      description: 'Un pack qui protège votre maison et votre famille à moins de 7 dt/mois seulement',
      price: 7,
      greenPrice: 6,
      garanties: [
        { title: 'Incendie, Explosion et Foudre', limit: '10 000 DT' },
        { title: 'Dégâts des Eaux', limit: '2 000 DT' },
        { title: 'Vol mobiliers et effets personnels', limit: '3 000 DT' },
        { title: 'Responsabilité Civile', limit: '20 000 DT' }
      ]
    },
    {
      name: 'YASMINE',
      description: 'Un pack qui protège votre maison et votre famille à moins de 10 dt/mois seulement',
      price: 10,
      greenPrice: 9,
      garanties: [
        { title: 'Incendie, Explosion et Foudre', limit: '15 000 DT' },
        { title: 'Dégâts des Eaux', limit: '3 000 DT' },
        { title: 'Vol mobiliers et effets personnels', limit: '5 000 DT' },
        { title: 'Responsabilité Civile', limit: '30 000 DT' },
        { title: 'Bris de glace', limit: '500 DT' }
      ]
    },
    {
      name: 'AMBAR',
      description: 'Un pack qui protège votre maison et votre famille à 13 dt/mois seulement',
      price: 13,
      greenPrice: 12,
      garanties: [
        { title: 'Incendie, Explosion et Foudre', limit: '20 000 DT' },
        { title: 'Dégâts des Eaux', limit: '5 000 DT' },
        { title: 'Vol mobiliers et effets personnels', limit: '7 000 DT' },
        { title: 'Responsabilité Civile', limit: '50 000 DT' },
        { title: 'Bris de glace', limit: '1 000 DT' },
        { title: 'Dommages électriques', limit: '2 000 DT' }
      ]
    }
  ];

  constructor(private dialog: MatDialog) {}

  openInsuranceForm(pack: InsurancePack): void {
    this.dialog.open(PackModalComponentComponent, {
      width: '90%',
      maxWidth: '1000px',
      data: { selectedPack: pack },
      panelClass: 'insurance-dialog'
    });
  }
}