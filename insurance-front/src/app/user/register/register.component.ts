import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ConfirmSnackbarComponent } from 'src/app/notif/confirm-snackbar/confirm-snackbar.component';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  formData: any = {
    name: '',
    lastname: '',
    dnaiss: '',
    cin: '',
    email: '',
    password: '',
    role: '',
    city: '',
    image: '',
    civility: ''
  };

  errorMessage: string = '';
  selectedFile: File | null = null;

  validationErrors: any = {
    cin: '',
    email: '',
    password: '',
    civility: '',
    role: ''
  };

  constructor(
    private readonly userService: UsersService,
    private readonly router: Router,
    private toastr: ToastrService,
    private snackBar: MatSnackBar
  ) {}

  validateCin() {
    const cin = this.formData.cin;
    if (!cin) {
      this.validationErrors.cin = 'Le champ CIN est obligatoire';
    } else if (!/^[0-9]{8}$/.test(cin)) {
      this.validationErrors.cin = 'Le CIN doit contenir exactement 8 chiffres';
    } else {
      this.validationErrors.cin = '';
    }
  }

  validateEmail() {
    const email = this.formData.email;
    if (!email) {
      this.validationErrors.email = "L'email est obligatoire";
    } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
      this.validationErrors.email = "Format de l'email invalide";
    } else {
      this.validationErrors.email = '';
    }
  }

  validatePassword() {
    const password = this.formData.password;
    if (!password) {
      this.validationErrors.password = 'Le mot de passe est obligatoire';
    } else if (password.length < 8) {
      this.validationErrors.password = "Le mot de passe doit contenir au moins 8 caractères";
    } else if (!/[A-Z]/.test(password)) {
      this.validationErrors.password = "Le mot de passe doit contenir au moins une lettre majuscule";
    } else if (!/[a-z]/.test(password)) {
      this.validationErrors.password = "Le mot de passe doit contenir au moins une lettre minuscule";
    } else if (!/[0-9]/.test(password)) {
      this.validationErrors.password = "Le mot de passe doit contenir au moins un chiffre";
    } else if (!/[!@#$%^&*(),.?\":{}|<>]/.test(password)) {
      this.validationErrors.password = "Le mot de passe doit contenir au moins un caractère spécial";
    } else {
      this.validationErrors.password = '';
    }
  }

  validateRole() {
    if (!this.formData.role) {
      this.validationErrors.role = 'Le rôle est obligatoire';
    } else {
      this.validationErrors.role = '';
    }
  }

  validateCivility() {
    if (!this.formData.civility) {
      this.validationErrors.civility = 'Civilité est obligatoire';
    } else {
      this.validationErrors.civility = '';
    }
  }
  async handleSubmit() {
    this.validateCin();
    this.validateEmail();
    this.validatePassword();
    this.validateRole();
    this.validateCivility();

    if (Object.values(this.validationErrors).some(err => err !== '')) {
      this.toastr.error("Veuillez corriger les erreurs de validation");
      return;
    }

    const snackRef = this.snackBar.openFromComponent(ConfirmSnackbarComponent, {
      panelClass: ['custom-snackbar-overlay'],
      data: {
        message: `Êtes-vous sûr d'enregistrer ${this.formData.email} ?`
      }
    });

    snackRef.onAction().subscribe(async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Aucun token trouvé');

        const formDataToSend = new FormData();
        formDataToSend.append('reg', new Blob([JSON.stringify(this.formData)], { type: 'application/json' }));
        if (this.selectedFile) formDataToSend.append('imageFile', this.selectedFile);

        const response = await this.userService.register(formDataToSend, token);
        if (response.statusCode === 200) {
          this.toastr.success('Utilisateur ajouté avec succès');
          this.router.navigate(['/users']);
        } else if (response.statusCode === 409) {
          this.toastr.error(response.message); // ✅ Affiche le message du backend
        } else {
          this.toastr.error(response.message || 'Erreur inconnue');
        }
      } catch (error: any) {
        this.toastr.error(error.message);
      }
    });
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = (e: any) => this.formData.image = e.target.result;
      reader.readAsDataURL(this.selectedFile);
    }
  }

  showError(message: string) {
    this.errorMessage = message;
    setTimeout(() => {
      this.errorMessage = '';
    }, 3000);
  }
}