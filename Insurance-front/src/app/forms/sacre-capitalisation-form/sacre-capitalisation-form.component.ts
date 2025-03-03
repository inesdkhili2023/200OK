import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-sacre-capitalisation-form',
  templateUrl: './sacre-capitalisation-form.component.html',
  styleUrls: ['./sacre-capitalisation-form.component.css']
})
export class SacreCapitalisationFormComponent {
  capitalisationForm: FormGroup;
  secondForm: FormGroup;
  showSecondForm = false;

  frequencies = ['Mensuelle', 'Trimestrielle', 'Semestrielle', 'Annuelle'];

  constructor(private fb: FormBuilder) {
    this.capitalisationForm = this.fb.group({
      dateEffet: ['', Validators.required],
      duree: [1, [Validators.required, Validators.min(1)]],
      capitalInitial: [0, [Validators.required, Validators.min(0)]],
      versementRegulier: [100, [Validators.required, Validators.min(1)]],
      frequenceVersement: ['Annuelle', Validators.required],
      primeVariable: ['Non', Validators.required]
    });

    this.secondForm = this.fb.group({
      montantAjout: [0, [Validators.required, Validators.min(1)]],
      commentaire: ['', Validators.required]
    });
  }

  onSubmitFirstForm() {
    if (this.capitalisationForm.valid) {
      this.showSecondForm = true;
    }
  }

  onSubmitSecondForm() {
    if (this.secondForm.valid) {
      alert('Deuxième formulaire soumis avec succès !');
    }
  }

}
