import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  constructor(
    private readonly usersService: UsersService,
    private router: Router
  ) { }


  email: string = ''
  password: string = ''
  errorMessage: string = ''

  async handleSubmit() {
    if (!this.email || !this.password) {
      this.showError("Email and Password is required");
      return
    }

    try {
      const response = await this.usersService.login(this.email, this.password);
      if(response.statusCode == 200 && response.token) {
        // Clear any existing tokens first
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('userId');
        
        // Store token, role, and userId
        localStorage.setItem('token', response.token);
        localStorage.setItem('role', response.role);
        
        // Store user ID if available
        if (response.userId) {
          localStorage.setItem('userId', response.userId.toString());
        }
        
        // Log token for debugging
        console.log('Role:', response.role);
        console.log('Token stored:', response.token);
        console.log('User ID stored:', response.userId);
        
        // Check role and redirect accordingly
        if (response.role === 'ADMIN') {
          // Redirect admin users to the admin dashboard
          this.router.navigate(['/admin/dashboard']);
        } else if (response.role === 'USER') {
          // For users, go to home or profile
          this.router.navigate(['/profile']);
        } else if (response.role === 'AGENT') {
          // For agents
          this.router.navigate(['/profile']);
        } else {
          // Default redirect
          this.router.navigate(['/']);
        }
      } else {
        this.showError(response.message || "Login failed");
      }
    } catch (error: any) {
      console.error('Login error:', error);
      this.showError(error.message || "An error occurred during login");
    }
  }

  showError(mess: string) {
    this.errorMessage = mess;
    setTimeout(() => {
      this.errorMessage = ''
    }, 3000)
  }
}