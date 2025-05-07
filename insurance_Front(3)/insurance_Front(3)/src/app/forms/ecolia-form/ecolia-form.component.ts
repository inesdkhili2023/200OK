import { CommonModule } from '@angular/common';  
import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatStepperModule } from '@angular/material/stepper';
import { NgIf } from '@angular/common';
import { DevisService } from 'src/app/services/ecolia.service';
import { OnInit } from '@angular/core';


import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-ecolia-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatStepperModule,
    NgIf
  ],
  templateUrl: './ecolia-form.component.html',
  styleUrls: ['./ecolia-form.component.css']
})
export class EcoliaFormComponent implements OnInit{
 
  @ViewChild(MatStepper) stepper: MatStepper | undefined;

  step1Form: FormGroup;
  step2Form: FormGroup;
  showSimulation: boolean = false;
  nombreEnfants: number = 0;
  montantEcolia: number = 31000;
  montantEcoliaPlus: number = 42200;
  selectedIndex: number = 0;
  primeTotale: number = 7;
  dateEffet: string = '2025-03-06';
  enfants: { nom: string, prenom: string, dateNaissance: string }[] = [];
  formuleChoisie: string = '';
  montantChoisi: number = 0;
  typePieceIdentite: any;
  typeAssuranceId: number | null = null;

  constructor(private fb: FormBuilder, private devisService: DevisService,private route: ActivatedRoute, private http: HttpClient) {
    this.step1Form = this.fb.group({
      typePieceIdentite: [null, Validators.required],
      typeAssuranceId: ['', Validators.required],
      numeroPieceIdentite: ['', Validators.required],
      nomPrenom: ['', Validators.required],
      numeroTelephone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      acceptConditions: [false, Validators.requiredTrue]
    });

    this.step2Form = this.fb.group({
      nombreEnfants: ['', Validators.required],
      dateEffet: ['', Validators.required],
      acceptConditions: [false, Validators.requiredTrue]
    });
  }
  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.typeAssuranceId = +params['typeAssuranceId'] || null;
      console.log('ID Assurance reçu:', this.typeAssuranceId);
    });
  }

  onSubmit(): void {
    console.log("Formulaire valide:", this.step1Form.valid);
    console.log("Type Assurance ID:", this.typeAssuranceId);
    const formData = this.step1Form.value; 
    formData.typeAssuranceId = Number(formData.typeAssuranceId);
    

  
    if (this.step1Form.valid && this.stepper && this.typeAssuranceId) {
      console.log("Formulaire valide, passage à l'étape suivante");
      this.stepper.next();
    } else {
      console.log("Formulaire étape 1 invalide ou Erreur : Type d'assurance non sélectionné");
    }
  }
  
  
  

  onPrevious(): void {
    if (this.stepper) {
      this.stepper.previous();
    }
  }
  submitForm(): void {
    if (this.step1Form.valid && this.step2Form.valid) {
      this.showSimulation = true;
      this.nombreEnfants = Number(this.step2Form.get('nombreEnfants')?.value) || 0;
      this.primeTotale = this.montantEcoliaPlus;
      this.dateEffet = this.step2Form.get('dateEffet')?.value || '2025-03-06';
  
      this.enfants = Array.from({ length: this.nombreEnfants }, () => ({ nom: '', prenom: '', dateNaissance: '' }));
  
      const typeAssuranceIdValue = this.step1Form.get('typeAssuranceId')?.value;
      const typeAssuranceId = Number(typeAssuranceIdValue);
  
      if (isNaN(typeAssuranceId) || typeAssuranceId <= 0) {
        alert("Le type d'assurance est invalide. Veuillez sélectionner un type d'assurance.");
        return;
      }
  
      const details = this.step1Form.value;
  
      // Créez un objet payload propre avant d'envoyer
      const payload = {
        typeAssuranceId: typeAssuranceId, // Assurez-vous qu'il est à la racine et non dans 'details'
        details: {
          typePieceIdentite: details.typePieceIdentite,
          numeroPieceIdentite: details.numeroPieceIdentite,
          nomPrenom: details.nomPrenom,
          numeroTelephone: details.numeroTelephone,
          email: details.email,
         
          nombreEnfants: details.nombreEnfants,
          dateEffet: details.dateEffet ,
          acceptConditions: details.acceptConditions
          // Ne mettez plus 'typeAssuranceId' ici
        }
      };
  
      // Appeler le service avec la nouvelle structure
      this.devisService.createDevis(typeAssuranceId, payload).subscribe((response: any) => {
        console.log('Devis créé:', response);
        this.stepper?.next();
      }, error => {
        console.error('Erreur lors de la création du devis', error);
        alert("Une erreur est survenue lors de la création du devis.");
      });
    } else {
      alert('Veuillez compléter toutes les étapes.');
    }
  }
  
  

  calculerMontants(): void {
    const enfants = Number(this.step2Form.get('nombreEnfants')?.value) || 1;
    this.montantEcolia = 31000 + (enfants - 1) * 22400;
    this.montantEcoliaPlus = 42200 + (enfants - 1) * 33800;
  }

  acheter(formule: string): void {
    this.formuleChoisie = formule;
    this.montantChoisi = formule === 'ECOLIA' ? this.montantEcolia : this.montantEcoliaPlus;

    if (this.stepper) {
      this.stepper.next();
    }
  }

  validerEtAfficherSimulation(): void {
    if (this.step2Form.valid) {
      this.showSimulation = true;
      this.nombreEnfants = Number(this.step2Form.get('nombreEnfants')?.value) || 1;
      this.primeTotale = this.montantEcoliaPlus;
      this.dateEffet = this.step2Form.get('dateEffet')?.value || '2025-03-06';

      this.enfants = Array.from({ length: this.nombreEnfants }, () => ({ nom: '', prenom: '', dateNaissance: '' }));

      console.log('Simulation validée:', {
        nombreEnfants: this.nombreEnfants,
        primeTotale: this.primeTotale,
        dateEffet: this.dateEffet,
        enfants: this.enfants
      });
    } else {
      alert("Veuillez remplir tous les champs requis.");
    }
  }

  passerEtapeSuivante(): void {
    if (this.showSimulation && this.stepper) {
      this.stepper.next();
    } else {
      alert("Veuillez afficher la simulation avant de passer à l'étape suivante.");
    }
  }

  onPayerEnLigne(): void {
    console.log('Paiement en ligne pour la formule :', this.formuleChoisie);
    console.log('Enfants à assurer :', this.enfants);
  }

 
}
