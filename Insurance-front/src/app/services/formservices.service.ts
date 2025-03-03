import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class FormservicesService {

  currentStep = 1;
  personneType: 'physique' | 'morale' = 'physique';

  mainForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.mainForm = this.fb.group({
      // Étape 1-2
      garanties: this.fb.group({/* ... */}),
      
      // Étape 3
      type: ['', Validators.required],
      civilite: ['', Validators.required],
      secteurActivite: ['', Validators.required],
      profession: ['', Validators.required],
      adresse: ['', Validators.required],
      ville: ['', Validators.required],
      codePostal: ['', Validators.required],
      
      // Étape 4
      raisonSociale: [''],
      registreCommerce: [''],
      secteur: [''],
      activite: [''],
      
      // Étape 5
      qualiteAssure: ['', Validators.required]
    });
  }
}
