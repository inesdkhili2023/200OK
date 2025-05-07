
import { Component, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';

import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';



@Component({
  selector: 'app-menu-lateral',
  templateUrl: './menu-lateral.component.html',
  styleUrls: ['./menu-lateral.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    CommonModule ,
    RouterModule
  ]
})
export class MenuLateralComponent {

  @ViewChild('menuLateral') menuLateral!: MatSidenav;

  // Méthode pour gérer le clic sur le bouton "Voir texte"
  onVoirTexteClick(): void {
    console.log('Bouton "Voir texte" cliqué');
    // Ajoutez ici la logique pour afficher le texte ou effectuer une action
  }

  // Méthode pour basculer l'état du menu latéral (ouvrir/fermer)
  toggleMenuLateral(): void {
    this.menuLateral.toggle();
  }
}