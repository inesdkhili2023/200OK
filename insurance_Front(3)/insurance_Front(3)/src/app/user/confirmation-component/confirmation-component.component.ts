import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-confirmation-component',
  templateUrl: './confirmation-component.component.html',
  styleUrls: ['./confirmation-component.component.css']
})
export class ConfirmationComponentComponent implements OnInit{
  token: string | null = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UsersService  // Injecte le service d'authentification
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.token = params['token'];  // Récupère le token depuis l'URL
      if (this.token) {
        this.userService.confirmEmail(this.token).subscribe(
          (response) => {
            console.log('Email confirmé, redirection vers la page de login');
            this.router.navigate(['/login']);  // Redirige vers la page de login
          },
          (error) => {
            console.error('Erreur de confirmation:', error);
          }
        );
      }
    });
  }
}
