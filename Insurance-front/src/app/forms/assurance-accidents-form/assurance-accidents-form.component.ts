import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


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

  constructor(private fb: FormBuilder) {
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
      captcha: ['', Validators.required],
      conditions: [false, Validators.requiredTrue]
    });
  }

  // Validation du premier formulaire
  onSubmitForm1() {
    if (this.form1.valid) {
      this.showForm2 = true;
    }
  }

  // Validation du second formulaire
  onSubmitForm2() {
    if (this.form2.valid) {
      alert('Devis envoyé avec succès !');
    }
  }

}
