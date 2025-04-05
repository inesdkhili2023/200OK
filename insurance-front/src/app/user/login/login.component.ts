import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  emailError: string = '';
  passwordError: string = '';

  emailVerified: boolean = false;
  passwordVerified: boolean = false;

  constructor(
    private readonly usersService: UsersService,
    private router: Router
  ) {}

  validateEmail() {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!this.email) {
      this.emailError = "L'email est requis";
      this.emailVerified = false;
    } else if (!emailPattern.test(this.email)) {
      this.emailError = "Format d'email invalide";
      this.emailVerified = false;
    } else {
      this.emailError = '';
      this.emailVerified = true;
    }
  }

  validatePassword() {
    if (!this.password) {
      this.passwordError = "Le mot de passe est requis";
      this.passwordVerified = false;
    } else if (this.password.length < 6) {
      this.passwordError = "Le mot de passe doit contenir au moins 6 caractères";
      this.passwordVerified = false;
    } else {
      this.passwordError = '';
      this.passwordVerified = true;
    }
  }

  async handleSubmit() {
    this.validateEmail();
    this.validatePassword();

    if (!this.emailVerified || !this.passwordVerified) {
      return;
    }

    try {
      const response = await this.usersService.login(this.email, this.password);
      if (response.statusCode === 200) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('role', response.role);
        this.usersService.setCurrentUser(response.user);

        if (this.usersService.isAdmin()) {
          this.router.navigate(['/admin/dashboard']);
        } else {
          this.router.navigate(['/dashboard']);
        }
      } else {
        this.showError(response.message);
      }
    } catch (error: any) {
      this.showError(error.message);
    }
  }

  showError(mess: string) {
    this.errorMessage = mess;
    setTimeout(() => {
      this.errorMessage = '';
    }, 3000);
  }
}
