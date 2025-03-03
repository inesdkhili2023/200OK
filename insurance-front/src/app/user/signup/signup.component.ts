import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
 formData: any = {
    name: '',
    lastname:'',
    dnaiss:'',
    cin:'',
    civility:'',
    email: '',
    password: '',
    city: '',
    image:''
  };
  errorMessage: string = '';
  selectedFile: File | null = null;
  constructor(
    private readonly userService: UsersService,
    private readonly router: Router
  ) { }

  async handleSubmit() {
    if (!this.formData.name || !this.formData.email || !this.formData.password || !this.formData.city || !this.formData.lastname 
        || !this.formData.cin || !this.formData.dnaiss || !this.formData.civility) {
      this.showError('Please fill in all fields.');
      return;
    }
  
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('reg', new Blob([JSON.stringify(this.formData)], { type: 'application/json' }));
  
      if (this.selectedFile) {
        formDataToSend.append('imageFile', this.selectedFile);
      }
  
      const response = await this.userService.signup(formDataToSend);
      if (response.statusCode === 200) {
        this.router.navigate(['/login']);
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
