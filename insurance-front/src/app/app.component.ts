import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { UsersService } from './services/users.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  showHeaderFooter = true;

  constructor(private router: Router,
    private userService: UsersService, // Assuming you have a UsersService to manage user state
  ) {
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event) => {
      const url = event.urlAfterRedirects;
      this.showHeaderFooter = !(
        url.startsWith('/admin') || 
        url.startsWith('/agent') || 
        url.startsWith('/user') ||
        url === '/dashboard'
      );
    });
    
  }
  ngOnInit(): void {
    this.userService.initializeAuthStatus();
  }
}
