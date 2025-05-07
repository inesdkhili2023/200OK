import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import {  ToastrService } from 'ngx-toastr';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  formData: any = {name: '',lastname: '',dnaiss: '',cin: '',civility: '',email: '',password: '',city: '',image: ''};

  errorMessage: string = '';
  selectedFile: File | null = null;
  webcamActive = false;
  visible:boolean = true;
  changetype:boolean =true;
  @ViewChild('video') videoRef!: ElementRef;
  @ViewChild('canvas') canvasRef!: ElementRef;
  // Messages d'erreur pour chaque champ
  nameError = '';
  lastnameError = '';
  cinError = '';
  emailError = '';
  passwordError = '';
  cityError='';
  nameVerified: boolean = false;
  lastnameVerified: boolean = false;
  cinVerified: boolean = false;
  emailVerified: boolean = false;
  cityVerified:boolean=false;
  passwordVerified: boolean = false;
  
  constructor(
    private readonly userService: UsersService,
    private readonly router: Router,
    private toastr: ToastrService
  ) {}
  ngAfterViewInit(): void {
    if (this.webcamActive) this.startWebcam();
  }
  async handleSubmit() {
     // Fermer la webcam avant tout
  if (this.webcamActive) {
    this.stopWebcam();
  }

  // Afficher le toast tout de suite
  this.toastr.warning('Cette opération peut prendre quelques secondes...');
    if (!this.validateForm()) {
      this.toastr.error('Veuillez remplir correctement tous les champs.');
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('reg', new Blob([JSON.stringify(this.formData)], { type: 'application/json' }));

      if (this.selectedFile) {
        formDataToSend.append('imageFile', this.selectedFile);
      } else if (this.formData.image) {
        const blob = this.dataURLtoBlob(this.formData.image);
        formDataToSend.append('imageFile', blob, 'captured.png');
      }

      const response = await this.userService.signup(formDataToSend);
      if (response.statusCode === 200) {
        this.toastr.success('Accédez à votre email pour vérifier votre compte');
        this.router.navigate(['/login']);
      } else {
        this.toastr.error(response.message);
      }
    } catch (error: any) {
      this.toastr.error(error.message);
    }
  }
  viewpass(){
    this.visible = !this.visible;
    this.changetype = !this.changetype;
  }
  validateForm(): boolean {
    this.validateName();
    this.validateLastName();
    this.validateCin();
    this.validateEmail();
    this.validatePassword();
    this.validatecity();

    return (
      this.nameError === '' &&
      this.lastnameError === '' &&
      this.cinError === '' &&
      this.emailError === '' &&
      this.cityError=== ''&&
      this.passwordError === '' &&
      this.formData.dnaiss !== '' &&
      this.formData.city !== '' &&
      this.formData.cin !== ''&&
      this.formData.civility !== ''
    );
  }
  generateStrongPassword() {
    const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+";
    let password = '';
    for (let i = 0; i < 8; i++) {  // La longueur du mot de passe peut être modifiée
      const randomIndex = Math.floor(Math.random() * charset.length);
      password += charset[randomIndex];
    }
    this.formData.password = password;  // Assigner le mot de passe généré à la variable
  }
  
  validateEmail() {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!this.formData.email.match(emailPattern)) {
      this.emailError = 'Email invalide';
      this.emailVerified = false;
    } else {
      this.emailError = '';
      this.emailVerified = true;
    }
  }
  
  validatecity() {
    // Vérification de la ville
    if (this.formData.city.trim().length === 0) {
      this.cityError = 'La ville est requise';
      this.cityVerified = false;
    } else {
      this.cityError = '';  // Clear error message
      this.cityVerified = true;  // Set city as verified
    }
}

  // Password validation
  validatePassword() {
    if (this.formData.password.length < 8) {
      this.passwordError = 'Le mot de passe doit contenir au moins 8 caractères';
      this.passwordVerified = false;
    } else {
      this.passwordError = '';
      this.passwordVerified = true;
    }
  }

  // Name validation
  validateName() {
    if (this.formData.name.trim().length === 0) {
      this.nameError = 'Le prénom est requis';
      this.nameVerified = false;
    } else {
      this.nameError = '';
      this.nameVerified = true;
    }
  }

  // Lastname validation
  validateLastName() {
    if (this.formData.lastname.trim().length === 0) {
      this.lastnameError = 'Le nom est requis';
      this.lastnameVerified = false;
    } else {
      this.lastnameError = '';
      this.lastnameVerified = true;
    }
  }

  // CIN validation
  validateCin() {
    const cinPattern = /^[0-9]{8}$/;
    if (!this.formData.cin.match(cinPattern)) {
      this.cinError = 'Le CIN doit contenir exactement 8 chiffres';
      this.cinVerified = false;
    } else {
      this.cinError = '';
      this.cinVerified = true;
    }
  }
  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];

    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = (e: any) => (this.formData.image = e.target.result);
      reader.readAsDataURL(this.selectedFile);
    }
  }
  captureImageFromWebcam() {
    const canvas: HTMLCanvasElement = this.canvasRef.nativeElement;
    const context = canvas.getContext('2d');
    context?.drawImage(this.videoRef.nativeElement, 0, 0, canvas.width, canvas.height);
    this.formData.image = canvas.toDataURL('image/png');
    this.selectedFile = null; // Clear uploaded file if webcam used
  }

  startWebcam() {
    this.webcamActive = true;
    navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
      this.videoRef.nativeElement.srcObject = stream;
    }).catch(err => this.showError("Impossible d'accéder à la webcam."));
  }

  stopWebcam() {
    const stream = this.videoRef.nativeElement.srcObject as MediaStream;
    stream.getTracks().forEach(track => track.stop());
    this.webcamActive = false;
  }

  dataURLtoBlob(dataURL: string): Blob {
    const arr = dataURL.split(',');
const mimeMatch = arr[0].match(/:(.*?);/);

if (!mimeMatch) {
  throw new Error("Format de DataURL invalide");
}

const mime = mimeMatch[1];
    const bstr = atob(arr[1]);
    let n = bstr.length; const u8arr = new Uint8Array(n);
    while (n--) u8arr[n] = bstr.charCodeAt(n);
    return new Blob([u8arr], { type: mime });
  }

  showError(message: string) {
    this.errorMessage = message;
    setTimeout(() => {
      this.errorMessage = ''; 
    }, 3000);
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }
  
}
