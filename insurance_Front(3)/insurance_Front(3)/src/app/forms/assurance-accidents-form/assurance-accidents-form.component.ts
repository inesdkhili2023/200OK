import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccidentService } from 'src/app/services/accident.service';
import { RecaptchaModule } from 'ng-recaptcha';

@Component({
  selector: 'app-assurance-accidents-form',
  templateUrl: './assurance-accidents-form.component.html',
  styleUrls: ['./assurance-accidents-form.component.css']
})
export class AssuranceAccidentsFormComponent {
  form1: FormGroup;
  form2: FormGroup;
  showForm2 = false;

  professions = ["ADMINISTRATEUR DE SOCIETE", "EMPLOYÉ", "CHEF D'ENTREPRISE"];
  franchises = ["AUCUNE", "7 jours", "15 jours"];
  fraisTraitement = ["500 TND", "1000 TND", "1500 TND"];
  captchaToken: string = '';

  constructor(private fb: FormBuilder, private accidentService: AccidentService) {
    // Formulaire 1
    this.form1 = this.fb.group({
      profession: ['', Validators.required],
      capitalDeces: [1000, Validators.required],
      capitalIPP: [1000, Validators.required],
      rente: [10, Validators.required],
      franchise: ['', Validators.required],
      fraisTraitement: ['', Validators.required]
    });

    // Formulaire 2
    this.form2 = this.fb.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      confirmEmail: ['', [Validators.required, Validators.email]],
      telephone: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]],
      conditions: [false, Validators.requiredTrue],
      
    });
  }

  // Validation et soumission du premier formulaire
  onSubmitForm1() {
    if (this.form1.valid) {
      this.showForm2 = true;
    }
  }
  

  onCaptchaResolved(token: string) {
    this.captchaToken = token;
    console.log('Captcha token:', token);
  }
  
  onSubmitForm2() {
    if (this.form2.valid && this.captchaToken) {  // This checks for both truthy and non-null
     // Set a maximum length for the captcha token
    const maxLength = 255; // Adjust based on column length
    const truncatedCaptchaToken = this.captchaToken?.substring(0, maxLength); // Truncate if necessary
      const payload = {
        typeAssuranceId: 7,
        details: {
          profession: this.form1.value.profession,
          capitalDeces: this.form1.value.capitalDeces,
          capitalIPP: this.form1.value.capitalIPP,
          rente: this.form1.value.rente,
          franchise: this.form1.value.franchise,
          fraisTraitement: this.form1.value.fraisTraitement,
      
          nomPrenom: this.form2.value.nom + ' ' + this.form2.value.prenom,
          numeroTelephone: this.form2.value.telephone,
          email: this.form2.value.email,
          acceptConditions: this.form2.value.conditions,
      
         
        }
      };
    
      this.accidentService.sendInsuranceData(payload).subscribe(
        response => {
          console.log('Devis envoyé avec succès', response);
          alert('Devis envoyé avec succès !');
        },
        error => {
          console.error('Erreur lors de l\'envoi du devis', error);
          alert('Une erreur est survenue. Veuillez réessayer.');
        }
      );
    } else {
      alert("Veuillez compléter tous les champs et valider le reCAPTCHA.");
    }
  }

}
