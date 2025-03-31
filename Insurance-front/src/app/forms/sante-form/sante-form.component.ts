import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-sante-form',
  templateUrl: './sante-form.component.html',
  styleUrls: ['./sante-form.component.css']
})
export class SanteFormComponent {
  onSubmit(form: NgForm) {
    if (form.valid) {
      console.log('Formulaire soumis avec succès !', form.value);

     
      const formData = {
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
      };

      
      this.sendFormData(formData);

    
      form.resetForm();
    } else {
      console.log('Le formulaire n\'est pas valide.');
    }
  }

  
  sendFormData(formData: any) {

    console.log('Envoi des données du formulaire...', formData);

   
  }

}
