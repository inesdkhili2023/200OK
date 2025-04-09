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
import { loadStripe } from '@stripe/stripe-js';

interface LineItem {
  price_data: {
    currency: string;
    product_data: {
      name: string;
    };
    unit_amount: number;
  };
  quantity: number;
}


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
  stripePromise = loadStripe('pk_test_51QzaZjAlOaBjJnq5f1pMTZVmNXfu4N0yeVlPsG3CsVpq6tYiTxDip0gwpdIKDlNeEMvvkXb9TMkXwvKxEjdnJSzN00afZtFVJ9'); // Remplace par ta clé publique
  



  constructor(private paiementService: PaiementService,private http: HttpClient) {
    this.contactForm = new FormGroup({
      numContrat: new FormControl('', Validators.required),
      montant: new FormControl('', [Validators.required, Validators.min(1)]), // ✅ champ montant
      rib: new FormControl('', [Validators.required, Validators.pattern('[0-9]{20,30}')]), // ✅ champ RIB
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

 
  async payerAvecStripe(clientSecret: string) {  // Ajoutez clientSecret comme argument
    const montant = this.contactForm.value.montant;  // Récupère le montant depuis le formulaire
    const stripe = await this.stripePromise;
    console.log("🛒 Stripe prêt ! En attente du paiement...");
  
    // Envoi du montant au backend pour créer un PaymentIntent
    this.http.post('http://localhost:8011/paiements/stripe-payment-intent', { montant })
      .subscribe(async (response: any) => {
        const clientSecret = response.clientSecret;  // Récupérer le clientSecret retourné
  
        if (!clientSecret) {
          console.error("❌ ClientSecret manquant");
          return;
        }
  
        const lineItems: LineItem[] = [{
          price_data: {
            currency: 'eur', // Devise
            product_data: {
              name: 'Produit à payer', // Nom du produit
            },
            unit_amount: montant * 100, // Convertir le montant en centimes
          },
          quantity: 1,
        }];
  
        // Effectuer la redirection vers le Checkout de Stripe avec les informations du paiement
        const result = await stripe?.redirectToCheckout({
          clientReferenceId: 'commande-123', // ID de la commande
          lineItems, // Utiliser la variable lineItems définie ci-dessus
          mode: 'payment',
          successUrl: 'http://localhost:4200/success',
          cancelUrl: 'http://localhost:4200/cancel',
        });
  
        if (result?.error) {
          console.error("❌ Erreur Stripe : ", result.error.message);
        }
      }, error => {
        console.error("❌ Erreur lors de la création du paiement : ", error);
      });
  }
  
  //createPaiement(paiement: any): Observable<any> {
   // console.log("📤 Données envoyées :", paiement);
   // return this.http.post(this.apiUrl, paiement).pipe(
     // catchError(error => {
       // console.error("❌ Erreur détectée :", error);
       // return throwError(error);
      //})
    //);
  //}
  onSubmit(contactForm: any) {
    console.log("Formulaire soumis !"); // Ajoute ce log pour vérifier que la méthode est bien appelée.
    console.log("Données du formulaire:", this.contactForm.value); 

    if (this.contactForm.valid) {
      const paiementData = {
        montant: this.contactForm.value.montant,
        rib: this.contactForm.value.rib,
        numContrat: this.contactForm.value.numContrat,
        numtel: this.contactForm.value.numtel,
        mail: this.contactForm.value.mail,
        confirmationMail: this.contactForm.value.confirmationMail,
        contrat: { numContrat: this.contactForm.value.numContrat }
      };
  
      console.log("📤 Données envoyées :", paiementData); // Log les données envoyées au backend.
      
      // Envoi des données au backend pour créer le paiement
      this.http.post('http://localhost:8011/paiements/create', paiementData)
        .subscribe({
          next: (response: any) => {
            console.log("Réponse reçue du backend :", response);
            const clientSecret = response.clientSecret;
            this.payerAvecStripe(clientSecret);
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
  
  
  
  

