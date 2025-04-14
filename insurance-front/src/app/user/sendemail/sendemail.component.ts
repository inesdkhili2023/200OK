import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import {  ToastrService } from 'ngx-toastr';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-sendemail',
  templateUrl: './sendemail.component.html',
  styleUrls: ['./sendemail.component.css']
})
export class SendemailComponent {
  email: string = '';
  showNotification: boolean = false;
  notificationMessage: string = '';

  constructor(private userService: UsersService, 
              private toastr: ToastrService
  ) {}

  // Envoyer l'e-mail de réinitialisation
  async onSubmit() {
    try {
      this.toastr.warning("cette opération prend un certain temps");
      const response = await this.userService.sendResetEmail(this.email);
      this.showNotification = true;
      this.notificationMessage = 'Un e-mail de réinitialisation a été envoyé à votre adresse e-mail.';
    } catch (error) {
      this.showNotification = true;

      if (error instanceof HttpErrorResponse) {
        // Erreur HTTP (par exemple, 404, 500, etc.)
        this.notificationMessage = 'Erreur : ' + (error.error?.message || 'Une erreur s\'est produite.');
      } else {
        // Erreur générique (par exemple, erreur réseau)
        this.notificationMessage = 'Erreur : Une erreur s\'est produite.';
      }
    }
  }

}
