import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { RouterModule } from '@angular/router';



@Component({
  selector: 'app-assurance-devis',
  standalone: true,
  templateUrl:'./assurance-devis.component.html',
  styleUrls: ['./assurance-devis.component.css'],
  imports: [ MatCardModule,MatMenuModule,RouterModule ]
 


})
export class AssuranceDevisComponent {

}
