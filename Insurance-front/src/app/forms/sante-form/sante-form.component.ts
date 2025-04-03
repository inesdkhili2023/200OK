import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { SanteFormService } from '../../services/sante-form.service';

@Component({
  selector: 'app-sante-form',
  templateUrl: './sante-form.component.html',
  styleUrls: ['./sante-form.component.css']
})
export class SanteFormComponent {
  typeAssuranceId: number = 6; // Ajout du typeAssuranceId fixe
  
  constructor(private santeFormService: SanteFormService) { }

  onSubmit(form: NgForm) {
    if (form.valid) {
      console.log('Formulaire soumis avec succès !', form.value);

      // Structurer le payload dans le format attendu
      const payload = {
        typeAssuranceId: this.typeAssuranceId,  // Le type d'assurance que vous utilisez
        details: {
          nom: form.value.nom,
          prenom: form.value.prenom,
          email: form.value.email,
          confirmationEmail: form.value.confirmationEmail,
          societe: form.value.societe,
          telephone: form.value.telephone,
          fonction: form.value.fonction,
          dateNaissance: form.value.dateNaissance,
          message: form.value.message,
          conditions: form.value.conditions
        }
      };

      // Envoi des données via le service
      this.santeFormService.envoyerFormulaire(payload).subscribe(
        response => {
          console.log('Réponse du serveur :', response);
          alert('Formulaire envoyé avec succès !');
          form.resetForm();
        },
        error => {
          console.error('Erreur lors de l\'envoi du formulaire :', error);
          alert('Erreur lors de l\'envoi du formulaire.');
        }
      );

    } else {
      console.log('Le formulaire n\'est pas valide.');
    }
  }
}
