import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-resetpassword',
  templateUrl: './resetpassword.component.html',
  styleUrls: ['./resetpassword.component.css']
})
export class ResetpasswordComponent implements OnInit {
  token: string = '';
  newPassword: string = '';
  showNotification: boolean = false;
  confirmPassword: string = ''; 
  notificationMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private userService: UsersService,
    private router: Router
  ) {}
  ngOnInit(): void {
    // Extraire le token de l'URL
    this.token = this.route.snapshot.queryParamMap.get('token') || '';
  }

  // Réinitialiser le mot de passe
  async onSubmit() {
      // Vérifier que les mots de passe correspondent
      if (this.newPassword !== this.confirmPassword) {
        this.showNotification = true;
        this.notificationMessage = 'Les mots de passe ne correspondent pas.';
        return; // Arrêter l'exécution si les mots de passe ne correspondent pas
      }
    try {
      const response = await this.userService.resetPassword(this.token, this.newPassword);
      this.showNotification = true;
      this.notificationMessage = 'Votre mot de passe a été réinitialisé avec succès.';

      // Rediriger vers la page de connexion après 3 secondes
      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 3000);
    } catch (error) {
      this.showNotification = true;
      this.notificationMessage = 'Erreur : ' + error;
    }
  }
}
