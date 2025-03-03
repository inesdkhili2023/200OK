<<<<<<< HEAD
import { Component } from '@angular/core';
=======
import { Component, OnInit } from '@angular/core';
>>>>>>> c9305956a030b291610f62d4a496788fd831d8e1
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
<<<<<<< HEAD
export class AppComponent {
  title = 'InsuranceProject';
  isDashboard = false;

  constructor(private router: Router) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.isDashboard = event.url.includes('/admin/dashboard');
    });
  }
}
=======
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
>>>>>>> c9305956a030b291610f62d4a496788fd831d8e1
