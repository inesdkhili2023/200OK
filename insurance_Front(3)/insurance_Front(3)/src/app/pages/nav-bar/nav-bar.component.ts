import { Component, OnInit, HostListener } from '@angular/core';
import { UsersService } from 'src/app/services/users.service';
import { Router } from '@angular/router';

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
  userRole: string = '';
  isMenuOpen: boolean = false;

  constructor(
    private userService: UsersService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.updateAuthStatus();
    
    // Subscribe to authentication changes
    this.userService.isAuthenticated$.subscribe(isAuth => {
      this.isAuthenticated = isAuth;
      this.updateAuthStatus();
    });
  }

  @HostListener('document:click', ['$event'])
  closeDropdowns(event: Event): void {
    // Close dropdown when clicking outside
    if (!(event.target as HTMLElement).closest('.dropdown')) {
      const openDropdowns = document.querySelectorAll('.dropdown-menu.show');
      openDropdowns.forEach(dropdown => {
        dropdown.classList.remove('show');
      });
    }
  }

  updateAuthStatus(): void {
    this.isAuthenticated = this.userService.isAuthenticated();
    this.isAdmin = this.userService.isAdmin();
    this.isUser = this.userService.isUser();
    this.isAgent = this.userService.isAgent();
    
    // Get user info if authenticated
    if (this.isAuthenticated) {
      const token = localStorage.getItem('token');
      if (token) {
        this.userService.getYourProfile(token).then(response => {
          if (response && response.ourUsers) {
            this.userName = response.ourUsers.name;
            this.userRole = response.ourUsers.role;
          }
        }).catch(error => {
          console.error('Error fetching user profile:', error);
        });
      }
    }
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  toggleDropdown(event: Event): void {
    event.preventDefault();
    const dropdownMenu = (event.target as HTMLElement).closest('.dropdown')?.querySelector('.dropdown-menu');
    if (dropdownMenu) {
      dropdownMenu.classList.toggle('show');
    }
  }

  logout(): void {
    this.userService.logOut();
    this.router.navigate(['/login']);
  }
}
