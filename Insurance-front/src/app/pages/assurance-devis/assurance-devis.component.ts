import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';


@Component({
  selector: 'app-assurance-devis',
  standalone: true,
  templateUrl:'./assurance-devis.component.html',
  styleUrls: ['./assurance-devis.component.css'],
  imports: [ MatCardModule,MatMenuModule,RouterModule ]
 


})
export class AssuranceDevisComponent {
  typeAssuranceId: number | null = null;

  constructor(private router: Router) {}
  setTypeAssuranceId(id: number, route: string) {
    this.typeAssuranceId = id;
    console.log("ID Assurance sélectionné:", this.typeAssuranceId);
    this.router.navigate([route], { queryParams: { typeAssuranceId: this.typeAssuranceId } });
}

  }

