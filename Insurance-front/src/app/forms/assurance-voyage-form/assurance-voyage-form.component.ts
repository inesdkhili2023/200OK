import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AssuranceVoyageService } from 'src/app/services/assurance-voyage.service';

@Component({
  selector: 'app-assurance-voyage-form',
  templateUrl: './assurance-voyage-form.component.html',
  styleUrls: ['./assurance-voyage-form.component.css']
})
export class AssuranceVoyageFormComponent {
  showMainForm = true;
  showTariff = false;
  showSouscripteurForm = false;
  showDialog = false;

  // Variables liées au formulaire principal
  duree: number = 1;
  dateDepart: string = '';
  dateRetour: string = '';
  coverageOption: string = '';
  nationality: string = 'Tunisienne';
  ageRange: string = '1-70';
  totalPremium: string = '';

  // Formulaire du souscripteur
  souscripteurForm: FormGroup;

  constructor(private fb: FormBuilder, private assuranceService: AssuranceVoyageService) {
    this.souscripteurForm = this.fb.group({
      cin: ['', Validators.required],
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      telephone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      confirmEmail: ['', [Validators.required, Validators.email]],
      conditions: [false, Validators.requiredTrue]
    });

    this.calculerDateRetour();
  }

  calculerDateRetour() {
    if (!this.dateDepart) {
      this.dateRetour = '';
      return;
    }
    let joursAjoutes = 0;

    switch (this.duree) {
      case 1: joursAjoutes = 8; break;
      case 9: joursAjoutes = 16; break;
      case 17: joursAjoutes = 32; break;
      case 33: joursAjoutes = 60; break;
      case 61: joursAjoutes = 90; break;
      case 365: joursAjoutes = 365; break;
      default: joursAjoutes = 0; break;
    }

    let date = new Date(this.dateDepart);
    date.setDate(date.getDate() + joursAjoutes);
    this.dateRetour = date.toISOString().split('T')[0];
  }

  showSouscripteur() {
    this.showMainForm = false;
    this.showSouscripteurForm = true;
  }

  showMain() {
    this.showMainForm = true;
    this.showSouscripteurForm = false;
  }

  buyInsurance() {
    this.showSouscripteur();
  }

  calculateTariff() {
    let basePrice = 10;

    if (this.duree >= 1 && this.duree <= 8) basePrice *= 1;
    else if (this.duree >= 9 && this.duree <= 16) basePrice *= 1.5;
    else if (this.duree >= 17 && this.duree <= 32) basePrice *= 2;
    else if (this.duree >= 33 && this.duree <= 60) basePrice *= 2.5;
    else if (this.duree >= 61 && this.duree <= 90) basePrice *= 3;
    else if (this.duree == 365) basePrice *= 5;

    if (this.coverageOption === "option2") basePrice *= 1.2;

    if (this.ageRange === "71-75") basePrice *= 1.3;
    else if (this.ageRange === "76-80") basePrice *= 1.5;

    this.totalPremium = basePrice.toFixed(2);
    this.showTariff = true;
  }

  onSubmit() {
    if (this.souscripteurForm.valid) {
      const formData = {
        typeAssuranceId: 4,
        details: {
          typeAssuranceId: 4,
          cin: this.souscripteurForm.value.numeroPieceIdentite,
          nom: this.souscripteurForm.value.nomPrenom,
          prenom: this.souscripteurForm.value.nomPrenom,
          telephone: this.souscripteurForm.value.numeroTelephone,
          email: this.souscripteurForm.value.email,
          conditions: this.souscripteurForm.value.acceptConditions,
          duree: this.duree,
          dateDebut: this.dateDepart,
          dateRetour: this.dateRetour,
          coverageOption: this.coverageOption,
          nationality: this.nationality,
          ageRange: this.ageRange,
          totalPremium: this.totalPremium
        }
      };

      this.assuranceService.submitAssuranceData(formData).subscribe({
        next: (response) => {
          console.log('Réponse du serveur:', response);
          this.showDialog = true;
        },
        error: (error) => {
          console.error('Erreur lors de l\'envoi des données:', error);
          alert('Une erreur est survenue, veuillez réessayer.');
        }
      });
    } else {
      alert('Veuillez remplir tous les champs requis.');
    }
  }

  closeDialog() {
    this.showDialog = false;
  }
}
