import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PackModalComponentComponent } from '../pack-modal-component/pack-modal-component.component';

@Component({
  selector: 'app-assurance-habitation-form',
  templateUrl: './assurance-habitation-form.component.html',
  styleUrls: ['./assurance-habitation-form.component.css']
})
export class AssuranceHabitationFormComponent {
  packs = [
    {
      name: 'FELL',
      description: 'Un pack qui protège votre maison et votre famille à moins de 7 dt/mois seulement',
      ecoPrice: '6 dt/mois',
      image: 'assets/images/fell.png',
    },
    {
      name: 'YASMINE',
      description: 'Un pack qui protège votre maison et votre famille à moins de 10 dt/mois seulement',
      ecoPrice: '9 dt/mois',
      image: 'assets/images/yasmine.png',
    },
    {
      name: 'AMBAR',
      description: 'Un pack qui protège votre maison et votre famille à 13 dt/mois seulement',
      ecoPrice: '12 dt/mois',
      image: 'assets/images/ambar.png',
    },
  ];

  constructor(public dialog: MatDialog) {}

  openPackModal(pack: any): void {
    this.dialog.open(PackModalComponentComponent, {
      width: '500px',
      data: pack,
    });
  }

}
