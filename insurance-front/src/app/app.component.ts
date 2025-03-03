import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'InsuranceProject';
  isDashboard = false;
  showHeaderFooter = true;
  constructor(private router: Router) {
    // Listen to route changes
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        // Check if the current route is the dashboard admin
        this.showHeaderFooter = !event.url.includes('/admin/dashboard');
      }
    });
  }

  ngOnInit(): void {
    // Initial check if the current route is the dashboard admin
    this.showHeaderFooter = !this.router.url.includes('/admin/dashboard');
  }
}
