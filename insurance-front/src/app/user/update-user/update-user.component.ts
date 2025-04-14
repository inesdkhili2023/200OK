import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ConfirmSnackbarComponent } from 'src/app/notif/confirm-snackbar/confirm-snackbar.component';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-update-user',
  templateUrl: './update-user.component.html',
  styleUrls: ['./update-user.component.css']
})
export class UpdateUserComponent implements OnInit {
  selectedFile: File | null = null;
  isAdmin: boolean = false;
  isUser: boolean = false;
  isAgent: boolean = false;
  userId: any;
  userData: any = {};
  errorMessage: string = '';
  validationErrors: any = {
    cin: '',
    email: '',
  };
  constructor(
    private readonly userService: UsersService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private toastr: ToastrService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.isAdmin = this.userService.isAdmin();
    this.isUser = this.userService.isUser();
    this.isAgent = this.userService.isAgent();
    this.getUserById();
  }

  async getUserById() {
    this.userId = this.route.snapshot.paramMap.get('id');
    const token = localStorage.getItem('token');
    if (!this.userId || !token) {
      this.toastr.error("User ID or Token is required");
      return;
    }

    try {
      let userDataResponse = await this.userService.getUsersById(this.userId, token);
      
      if (userDataResponse.ourUsers.dnaiss) {
        const date = new Date(userDataResponse.ourUsers.dnaiss);
        userDataResponse.ourUsers.dnaiss = date.toISOString().split('T')[0];
      }

      // Vérifier et construire l'URL complète de l'image
      if (userDataResponse.ourUsers.image && !userDataResponse.ourUsers.image.startsWith('http')) {
        userDataResponse.ourUsers.image = `http://localhost:1010/uploads/${userDataResponse.ourUsers.image}`;
      }

      this.userData = userDataResponse.ourUsers;
    } catch (error: any) {
      this.showError(error.message);
    }
  }
  validateCin() {
    const cin = this.userData.cin;
    if (!/^[0-9]{8}$/.test(cin)) {
      this.validationErrors.cin = 'Le CIN doit contenir exactement 8 chiffres';
    } else {
      this.validationErrors.cin = '';
    }
  }
  validateEmail() {
    const email = this.userData.email;
    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
      this.validationErrors.email = "Format de l'email invalide";
    } else {
      this.validationErrors.email = '';
    }
  }
  async updateUser() {
    this.validateCin();
    this.validateEmail();
  
    if (this.validationErrors.cin || this.validationErrors.email) {
      this.toastr.error("Veuillez corriger les erreurs de validation");
      return;
    }
  
    const snackRef = this.snackBar.openFromComponent(ConfirmSnackbarComponent, {
      panelClass: ['custom-snackbar-overlay'],
      data: { message: `Êtes-vous sûr de modifier cet utilisateur ?` }
    });
  
    snackRef.onAction().subscribe(async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error("Token not found");
  
        const userDataToSend = {
          name: this.userData.name,
          email: this.userData.email,
          city: this.userData.city,
          role: this.userData.role,
          lastname: this.userData.lastname,
          dnaiss: this.userData.dnaiss,
          civility: this.userData.civility,
          cin: this.userData.cin,
          image: this.userData.image,
        };
  
        const formDataToSend = new FormData();
        formDataToSend.append('reqres', new Blob([JSON.stringify(userDataToSend)], { type: 'application/json' }));
        if (this.selectedFile) {
          formDataToSend.append('imageFile', this.selectedFile);
        }
  
        const res = await this.userService.updateUser(this.userId, formDataToSend, token);
  
        if (res.statusCode === 200 && this.isAdmin) {
          this.toastr.success("Mise à jour réussie");
          this.router.navigate(['/admin/users']);
        } else if (res.statusCode === 200 && this.isUser) {
          this.toastr.success("Mise à jour réussie");
          this.router.navigate(['/user/profile']);

        }
        else if (res.statusCode === 200 && this.isAgent) {
          this.toastr.success("Mise à jour réussie");
          this.router.navigate(['/agent/profile']);
          
        } else {
          this.showError(res.message);
        }
  
      } catch (error: any) {
        this.showError(error.message);
      }
    });
  }
  
  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];

    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.userData.image = e.target.result;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  showError(mess: string) {
    this.errorMessage = mess;
    setTimeout(() => {
      this.errorMessage = '';
    }, 3000);
  }
}
