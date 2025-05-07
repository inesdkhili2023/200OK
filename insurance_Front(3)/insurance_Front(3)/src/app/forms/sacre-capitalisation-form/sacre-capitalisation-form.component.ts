import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CapitalisationService } from '../../services/capitalisation.service'; // Décommente si tu veux utiliser un service

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

  constructor(
    private fb: FormBuilder,
    private capitalisationService: CapitalisationService // Décommente si tu veux utiliser un service
  ) {
    // Premier formulaire
    this.capitalisationForm = this.fb.group({
      dateEffet: ['', Validators.required],
      duree: [1, [Validators.required, Validators.min(1)]],
      capitalInitial: [0, [Validators.required, Validators.min(0)]],
      versementRegulier: [100, [Validators.required, Validators.min(1)]],
      frequenceVersement: ['Annuelle', Validators.required],
      primeVariable: ['Non', Validators.required]
    });

    // Deuxième formulaire
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
    if (this.secondForm.valid && this.capitalisationForm.valid) {
      const payload = {
        typeAssuranceId: 8,
        details: {
          dateEffet: this.capitalisationForm.value.dateEffet,
          duree: this.capitalisationForm.value.duree,
          capitalInitial: this.capitalisationForm.value.capitalInitial,
          versementRegulier: this.capitalisationForm.value.versementRegulier,
          frequenceVersement: this.capitalisationForm.value.frequenceVersement,
          primeVariable: this.capitalisationForm.value.primeVariable,
          montantAjout: this.secondForm.value.montantAjout,
          commentaire: this.secondForm.value.commentaire
        }
      };

      // Tu peux envoyer ce payload via un service si besoin :
      
      this.capitalisationService.sendCapitalisationData(payload).subscribe(
        (res: any) => {
          console.log('Données envoyées avec succès', res);
          alert('Formulaire soumis avec succès !');
        },
        (err: any) => {
          console.error('Erreur lors de l\'envoi', err);
          alert('Une erreur est survenue.');
        }
      );
      
      

      // Pour test uniquement
      console.log('Payload:', payload);
      alert('Formulaire soumis avec succès !');
    }
  }
}
