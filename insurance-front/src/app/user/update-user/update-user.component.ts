import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
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
  userId: any;
  userData: any = {};
  errorMessage: string = '';

  constructor(
    private readonly userService: UsersService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.isAdmin = this.userService.isAdmin();
    this.isUser = this.userService.isUser();
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

  async updateUser() {
    const confirmUpdate = this.toastr.success("Utilisateur est modifiée");
    if (!confirmUpdate) return;

    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error("Token not found");
        }

        // Créer un nouvel objet sans le champ `authorities`
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
            password: this.userData.password // Si nécessaire
        };

        const formDataToSend = new FormData();
        formDataToSend.append('reqres', new Blob([JSON.stringify(userDataToSend)], { type: 'application/json' }));

        if (this.selectedFile) {
            formDataToSend.append('imageFile', this.selectedFile);
        }

        const res = await this.userService.updateUser(this.userId, formDataToSend, token);
        console.log(res);

        if (res.statusCode === 200 && this.isAdmin) {
            this.router.navigate(['/users']);
        } else if (res.statusCode === 200) {
            this.router.navigate(['/profile']);
        } else {
            this.showError(res.message);
        }
    } catch (error: any) {
        this.showError(error.message);
    }
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
