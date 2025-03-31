import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';


@Component({
  
  selector: 'app-assurance-voyage-form',
  templateUrl: './assurance-voyage-form.component.html',
  styleUrls: ['./assurance-voyage-form.component.css']
})

  export class AssuranceVoyageFormComponent {
    // Variables pour contrôler l'affichage des formulaires
    showMainForm = true;
    showTariff = false;
    showSouscripteurForm = false;
    showDialog = false;
    
    contractDuration = '9-16';
    departureDate: string = '';
    returnDate: string = '';
    coverageOption: string = '';
    nationality: string = 'Tunisienne';
    ageRange: string = '1-70';
    totalPremium: string = '';
    dateDepart: string = ''; 
   
    duree: number = 1; // Valeur par défaut
    dateDebut: Date = new Date(); // Date de début, à adapter selon ton besoin

   
    dateRetour: string = ''; 
    souscripteurForm: FormGroup;
  
 
  
    constructor(private fb: FormBuilder) {
      this.souscripteurForm = this.fb.group({
        cin: ['', Validators.required],
        nom: ['', Validators.required],
        prenom: ['', Validators.required],
        telephone: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        confirmEmail: ['', [Validators.required, Validators.email]],
        conditions: [false, Validators.requiredTrue],
      
      
      });
      this.calculerDateRetour();
    }
  
    // Méthode pour calculer la date de retour
    calculerDateRetour() {
      if (!this.dateDepart) {
        this.dateRetour = ''; // Si la date de départ n'est pas sélectionnée, vider la date de retour
        return;
      }
      let joursAjoutes = 0;
  
      switch (this.duree) {
        case 1:
          joursAjoutes = 8;
          break;
        case 9:
          joursAjoutes = 16;
          break;
        case 17:
          joursAjoutes = 32;
          break;
        case 33:
          joursAjoutes = 60;
          break;
        case 61:
          joursAjoutes = 90;
          break;
        case 365:
          joursAjoutes = 365;
          break;
        default:
          joursAjoutes = 0;
          break;
      }
      let date = new Date(this.dateDebut);
      date.setDate(date.getDate() + joursAjoutes);
  
      // Conversion au format YYYY-MM-DD pour l'input date
      this.dateRetour = date.toISOString().split('T')[0];
    }
    // Méthode pour afficher le formulaire du souscripteur
    showSouscripteur() {
      this.showMainForm = false;
      this.showSouscripteurForm = true;
    }
  
    // Méthode pour revenir au formulaire principal
    showMain() {
      this.showMainForm = true;
      this.showSouscripteurForm = false;
    }
  
   
   
    // Méthode pour acheter l'assurance
    buyInsurance() {
      this.showSouscripteur();
    }
    calculateTariff() {
      let basePrice = 10; // Prix de base
    
      // Ajustement en fonction de la durée du voyage
      if (this.duree >= 1 && this.duree <= 8) basePrice *= 1;
      else if (this.duree >= 9 && this.duree <= 16) basePrice *= 1.5;
      else if (this.duree >= 17 && this.duree <= 32) basePrice *= 2;
      else if (this.duree >= 33 && this.duree <= 60) basePrice *= 2.5;
      else if (this.duree >= 61 && this.duree <= 90) basePrice *= 3;
      else if (this.duree == 365) basePrice *= 5;
    
      // Ajustement en fonction de la zone de couverture
      if (this.coverageOption === "option2") basePrice *= 1.2;
    
      // **Ajustement en fonction de la tranche d'âge**
      if (this.ageRange === "71-75") basePrice *= 1.3; // Augmentation de 30% pour 71-75 ans
      else if (this.ageRange === "76-80") basePrice *= 1.5; // Augmentation de 50% pour 76-80 ans
    
      this.totalPremium = basePrice.toFixed(2); // Formater en deux décimales
      this.showTariff = true;
    }
    
  
    // Méthode pour soumettre le formulaire du souscripteur
    onSubmit() {
      if (this.souscripteurForm.valid) {
        console.log('Form Submitted', this.souscripteurForm.value);
        // Traitez la soumission du formulaire (par exemple, envoyez les données au serveur)
        this.showDialog = true; // Affichez la boîte de dialogue après la soumission
      } else {
        alert('Veuillez remplir tous les champs requis.');
      }
    }
  
    // Méthode pour fermer la boîte de dialogue
    closeDialog() {
      this.showDialog = false;
    }
  }

