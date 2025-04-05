import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  formData: any = {
    name: '',
    lastname:'',
    dnaiss:'',
    cin:'',
    email: '',
    password: '',
    role: '',
    city: '',
    image:'',
    civility:''
  };
  errorMessage: string = '';
  selectedFile: File | null = null;
  constructor(
    private readonly userService: UsersService,
    private readonly router: Router,
     private  toastr: ToastrService
  ) { }

  async handleSubmit() {
    // Vérifier si tous les champs obligatoires sont remplis
    if (!this.formData.name || !this.formData.email || !this.formData.password || !this.formData.role || !this.formData.city 
     || !this.formData.lastname || !this.formData.dnaiss || !this.formData.cin || !this.formData.civility) {
      this.toastr.error('Please fill in all fields.');
      return;
    }
  
    // Demander confirmation à l'utilisateur avant l'inscription
    const confirmRegistration = this.toastr.success('Utilisateur est ajouté avec succées');
    if (!confirmRegistration) {
      return;
    }
  
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }
  
      // Création de l'objet FormData
      const formDataToSend = new FormData();
      formDataToSend.append('reg', new Blob([JSON.stringify(this.formData)], { type: 'application/json' }));
  
      // Ajouter l’image si elle est sélectionnée
      if (this.selectedFile) {
        formDataToSend.append('imageFile', this.selectedFile);
      }
  
      // Envoi des données via l’API
      const response = await this.userService.register(formDataToSend, token);
      if (response.statusCode === 200) {
        this.router.navigate(['/users']);
      } else {
        this.showError(response.message);
      }
    } catch (error: any) {
      this.showError(error.message);
    }
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
      this.errorMessage = ''; // Clear the error message after the specified duration
    }, 3000);
  }
}
