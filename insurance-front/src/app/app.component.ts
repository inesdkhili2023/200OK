import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'InsuranceProject';
  isDashboard = false;
  displayHeaderFooter: boolean = true;

  constructor(private router: Router) {
    // Subscribe to router events
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // Hide header & footer on certain routes
        if (event.url === '/agent-espace' || event.url.startsWith('/agent-espace/')) {
          this.displayHeaderFooter = false;
        } else {
          this.displayHeaderFooter = true;
        }
      }
    });
 
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.isDashboard = event.url.includes('/admin/dashboard');
    });
  }
}