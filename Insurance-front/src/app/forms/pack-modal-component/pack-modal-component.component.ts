import { Component, Inject ,OnInit } from '@angular/core';
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
export class PackModalComponentComponent  implements OnInit {
  
  currentStep = 0;
  today = new Date().toISOString().split('T')[0];
  
  // Form groups with initial empty FormGroups
  subscriberForm: FormGroup = this.fb.group({});
  housingForm: FormGroup = this.fb.group({});
  guaranteesForm: FormGroup = this.fb.group({});

  // Options
  civiliteOptions = ['M', 'Mme'];
  secteurOptions = ['Agriculture', 'Artisanat', 'Commerce', 'Industrie', 'Services'];
  professionOptions = ['Agriculteur', 'Artisan', 'Commerçant', 'Cadre', 'Employé', 'Ouvrier'];
  qualiteOptions = ['Propriétaire', 'Locataire', 'Usufruitier'];
  villesOptions = ['Ariana', 'Tunis', 'Sousse', 'Sfax'];
  
  guarantees = [
    { id: 1, name: 'Incendie, Explosion et Foudre', limit: '20 000 DT' },
    { id: 2, name: 'Frais de déblais', limit: '1 000 DT' },
    { id: 3, name: 'Frais de déplacement et de replacement', limit: '500 DT' },
    { id: 4, name: 'Frais d\'intervention de secours et sauvetage', limit: '1 000 DT' },
    { id: 5, name: 'Tempêtes, ouragans et cyclones', limit: '10 000 DT' },
    { id: 6, name: 'Dommages électriques et électroniques', limit: '2 000 DT' },
    { id: 7, name: 'Dégâts des Eaux', limit: '3 000 DT' },
    { id: 8, name: 'Frais de recherche des fuites', limit: '500 DT' },
    { id: 9, name: 'Vol : mobiliers et effets personnel', limit: '7 000 DT' }
  ];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<PackModalComponentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    // Configuration de la taille du modal
    this.dialogRef.updateSize('80vw', 'auto'); // 80% de la largeur de la vue, hauteur automatique
  }

  ngOnInit(): void {
    this.initForms();
  }

  private initForms(): void {
    this.subscriberForm = this.fb.group({
      type: ['PERSONNE PHYSIQUE', Validators.required],
      cin: ['', Validators.required],
      delivreeA: [''],
      delivreeLe: [''],
      civilite: ['', Validators.required],
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      dateNaissance: ['', Validators.required],
      secteur: ['', Validators.required],
      profession: ['', Validators.required],
      adresse: ['', Validators.required],
      ville: ['', Validators.required],
      codePostal: ['', Validators.required],
      telephone: ['', [Validators.required, Validators.pattern(/^[0-9]{8}$/)]],
      email: ['', [Validators.required, Validators.email]],
      confirmEmail: ['', [Validators.required, Validators.email]]
    });

    this.housingForm = this.fb.group({
      dateDebut: ['', Validators.required],
      dateFin: ['', Validators.required],
      adresse: ['', Validators.required],
      codePostal: ['', Validators.required],
      ville: ['', Validators.required],
      surface: ['', [Validators.required, Validators.min(1)]],
      valeur: ['', [Validators.required, Validators.min(1)]],
      qualite: ['', Validators.required],
      photovoltaique: ['non', Validators.required]
    });

    this.guaranteesForm = this.fb.group({
      selectedGuarantees: [[], Validators.required]
    });
  }

  toggleGuarantee(garantie: any): void {
    const selected = this.guaranteesForm.get('selectedGuarantees')?.value;
    const index = selected.indexOf(garantie.id);
    
    if (index === -1) {
      selected.push(garantie.id);
    } else {
      selected.splice(index, 1);
    }
    
    this.guaranteesForm.get('selectedGuarantees')?.setValue(selected);
  }

  isGuaranteeSelected(garantie: any): boolean {
    return this.guaranteesForm.get('selectedGuarantees')?.value.includes(garantie.id);
  }

  nextStep(): void {
    if (this.isStepValid(this.currentStep)) {
      this.currentStep++;
    }
  }

  previousStep(): void {
    this.currentStep--;
  }

  isStepValid(stepIndex: number): boolean {
    switch (stepIndex) {
      case 0: return this.subscriberForm.valid;
      case 1: return this.housingForm.valid;
      case 2: return this.guaranteesForm.valid;
      default: return false;
    }
  }

  submitForm(): void {
    if (this.isFormValid()) {
      const formData = {
        subscriber: this.subscriberForm.value,
        housing: this.housingForm.value,
        guarantees: this.guaranteesForm.value.selectedGuarantees.map((id: number) => 
          this.guarantees.find(g => g.id === id))
      };
      console.log('Form submitted', formData);
      // Ici vous pouvez ajouter la logique pour soumettre le formulaire
      alert('Formulaire soumis avec succès!');
    }
  }

  isFormValid(): boolean {
    return this.subscriberForm.valid && 
           this.housingForm.valid && 
           this.guaranteesForm.valid;
  }
}