import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {
  isAuthenticated: boolean = false;
  isAdmin: boolean = false;
  isUser: boolean = false;
  isAgent: boolean = false;
  userName: string = '';
  userImage: string = 'assets/images/avatar-placeholder.png';
  profileInfo: any = null;

  constructor(
    private readonly userService: UsersService,
    private readonly router: Router,
    private readonly toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.userService.isAuthenticated$.subscribe(auth => {
      this.isAuthenticated = auth;
      if (auth) {
        this.loadProfile();
      } else {
        this.profileInfo = null;
      }
    });
    
    this.userService.isUser$.subscribe(user => this.isUser = user);
    this.userService.isAdmin$.subscribe(admin => this.isAdmin = admin);
    this.userService.isAgent$.subscribe(agent => this.isAgent = agent);
    
    // Charger le profil si déjà authentifié
    if (this.userService.isAuthenticated()) {
      this.loadProfile();
    }
  }

  async loadProfile() {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error("No token found");
      }
      
      this.profileInfo = await this.userService.getYourProfile(token);
      
      // Mettre à jour les propriétés pour une utilisation plus simple dans le template
      if (this.profileInfo?.ourUsers) {
        this.userName = this.profileInfo.ourUsers.name;
        console.log(this.profileInfo.ourUsers);
        this.userImage = this.profileInfo.ourUsers.image ;
      }
    } catch (error: any) {
      console.error("Error loading profile:", error.message);
      this.userImage = 'assets/images/avatar-placeholder.png';
      this.userName = '';
    }
  }

  logout(): void {
    this.userService.logOut();
    this.toastr.success("Déconnexion réussie");
    this.router.navigate(['/login']);
  }

  goToFaceDetection(): void {
    this.router.navigate(['/detect-face']);
  }
}