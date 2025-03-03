import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

interface Garantie {
  title: string;
  limit: string;
}

@Component({
  selector: 'app-pack-modal-component',
  templateUrl: './pack-modal-component.component.html',
  styleUrls: ['./pack-modal-component.component.css']
})
export class PackModalComponentComponent {
  garantiesForm!: FormGroup;
  subscriberForm!: FormGroup;
  moralForm!: FormGroup;
  housingForm!: FormGroup;

  currentStep = 1;
  showMoralFields = false;
  selectedFamilyMembers = 5;
  familyMembersOptions = Array.from({length: 10}, (_, i) => i + 1);
  
  // Listes déroulantes
  secteurs = ['Industrie', 'Commerce', 'Services'];
  professions = ['Cadre', 'Technicien', 'Consultant'];
  secteursMoral = ['IT', 'Construction', 'Finance'];
  activites = ['Développement', 'Production', 'Consulting'];
  codesPostaux = [1000, 2000, 3000];
  qualites = ['Proprietaire', 'Locataire', 'Usufruitier'];

  garanties: Garantie[] = [
    { title: '1/ Incendie, Explosion et Foudre', limit: '20 000 DT' },
    { title: '2/ Frais de déblais', limit: '1 000 DT' },
    { title: '3/ Frais de déplacement', limit: '500 DT' },
    { title: '1/ Incendie, Explosion et Foudre', limit: '20 000 DT' },
    { title: '2/ Frais de déblais', limit: '1 000 DT' },
    { title: '3/ Frais de déplacement et de replacement', limit: '500 DT' },
    { title: '4/ Frais d\'intervention de secours et sauvetage', limit: '1 000 DT' },
   // { title: '5/ Tempêtes, ouragans et cyclones', limit: '10 000 DT' },
   // { title: '6/ Choc d\'un véhicule terrestre', limit: '3 000 DT' },
   // { title: '7/ Choc Aéronef', limit: '2 000 DT' },
   // { title: '8/ Tremblement de terre', limit: '3 000 DT' },
   // { title: '9/ Inondation', limit: '500 DT' },
   // { title: '10/ Dommages électriques et électroniques', limit: '2 000 DT' },
   // { title: '11/ Dégâts des Eaux', limit: '3 000 DT' }
    // Ajouter toutes les autres garanties ici...
  ];

  constructor(
    public dialogRef: MatDialogRef<PackModalComponentComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.initForms();
  }

  private initForms(): void {
    this.garantiesForm = this.fb.group({
      selectedFamilyMembers: [this.selectedFamilyMembers, Validators.required]
    });

    this.subscriberForm = this.fb.group({
      type: ['physical', Validators.required],
      civilite: ['M', Validators.required],
      secteur: ['', Validators.required],
      profession: ['', Validators.required]
    });

    this.moralForm = this.fb.group({
      secteurMoral: ['', Validators.required],
      activite: ['', Validators.required],
      codePostal: ['', Validators.required]
    });

    this.housingForm = this.fb.group({
      qualite: ['', Validators.required],
      photovoltaique: ['non', Validators.required],
      surface: ['', [Validators.required, Validators.min(1)]]
    });
  }

  getStepTitle(): string {
    const titles: { [key: number]: string } = {
      1: 'Garanties',
      2: 'Souscripteur',
      3: 'Informations Société',
      4: 'Logement'
    };
    return titles[this.currentStep] || '';
  }

  nextStep(): void {
    if (this.isFormValid()) {
      if (this.currentStep === 2 && this.subscriberForm.value.type === 'moral') {
        this.currentStep = 3;
      } else {
        this.currentStep = Math.min(this.currentStep + 1, 4);
      }
    }
  }

  previousStep(): void {
    if (this.currentStep === 3 && this.subscriberForm.value.type === 'moral') {
      this.currentStep = 2;
    } else {
      this.currentStep = Math.max(this.currentStep - 1, 1);
    }
  }

  isFormValid(): boolean {
    switch(this.currentStep) {
      case 1: return this.garantiesForm.valid;
      case 2: return this.subscriberForm.valid;
      case 3: return this.moralForm.valid;
      case 4: return this.housingForm.valid;
      default: return false;
    }
  }

  calculatePrice(): number {
    return this.selectedFamilyMembers * 7;
  }

  submitForm(): void {
    const formData = {
      ...this.garantiesForm.value,
      ...this.subscriberForm.value,
      ...this.moralForm.value,
      ...this.housingForm.value
    };
    console.log('Form submitted:', formData);
    this.dialogRef.close(formData);
  }

  close(): void {
    this.dialogRef.close();
  }
}