import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormBuilder, FormGroup, Validators, FormControl,AbstractControl } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { PaiementService, Paiement } from '../../services/paiement.service';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { AfterViewInit } from '@angular/core';




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
  numtel: new FormControl('', [Validators.required, Validators.pattern('[0-9]{8}')]),
  mail: new FormControl('', [Validators.required, Validators.email]),
  confirmationMail: new FormControl('', [Validators.required, Validators.email]),
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
  onSubmit(contactForm: any) {
    if (this.contactForm.valid) {
      const paiementData: Paiement = {
        numContrat: this.contactForm.value.numContrat,
        montant: this.contactForm.value.montant,
        numtel: this.contactForm.value.numtel,
        mail: this.contactForm.value.mail,
        confirmationMail: this.contactForm.value.confirmationMail,
        contrat: { numContrat: this.contactForm.value.numContrat }
      };
  
      console.log("✅ Données envoyées :", paiementData);
  
      this.createPaiement(paiementData).subscribe({
        next: (response) => {
          console.log("✅ Réponse reçue :", response);
          alert("Paiement enregistré !");
        },
        error: (error) => {
          console.error("❌ Erreur :", error);
        }
      });
    }
  }
  
  
  private emailMatchValidator(control: AbstractControl) {
    const email = control.get('email')?.value;
    const confirmEmail = control.get('confirmEmail')?.value;
    return email === confirmEmail ? null : { emailMismatch: true };
  }

  
  }
  
  
  
  

