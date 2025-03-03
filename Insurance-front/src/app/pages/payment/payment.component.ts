import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { PaiementService, Paiement } from '../../services/paiement.service';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatCheckboxModule,
    MatButtonModule,
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {
  paiements: Paiement[] = [];
  contactForm: FormGroup;
  apiUrl: string = 'http://localhost:8011/paiements/create';

  constructor(private paiementService: PaiementService,private http: HttpClient) {
    this.contactForm = new FormGroup({
      numContrat: new FormControl('', Validators.required),
      name: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      confirmEmail: new FormControl('', [Validators.required, Validators.email]),
      terms: new FormControl(false, Validators.requiredTrue)
    });
  }

  ngOnInit() {
    this.getPaiements();
  }

  getPaiements() {
    this.paiementService.getAllPaiements().subscribe(data => {
      this.paiements = data;
    });
  }

  supprimerPaiement(id: number) {
    this.paiementService.deletePaiement(id).subscribe(() => {
      this.paiements = this.paiements.filter(p => p.id !== id);
    });
  }

  createPaiement(paiement: any): Observable<any> {
    console.log("📤 Données envoyées :", paiement);
    return this.http.post(this.apiUrl, paiement).pipe(
      catchError(error => {
        console.error("❌ Erreur détectée :", error);
        return throwError(error);
      })
    );
  }
  onSubmit( contactForm: any) {
    if ( contactForm.valid) {
      console.log("✅ Formulaire valide :",  contactForm.value);
  
      this.createPaiement( contactForm.value).subscribe({
        next: (response) => {
          console.log("🎉 Paiement créé avec succès :", response);
          alert("Paiement enregistré !");
        },
        error: (error) => {
          console.error("❌ Erreur lors de la création du paiement :", error);
          alert("Erreur lors de l'enregistrement du paiement !");
        }
      });
    } else {
      console.warn("⚠️ Formulaire invalide !");
    }
  }
  
  
  
  
}
