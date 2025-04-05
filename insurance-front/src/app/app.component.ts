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
  showHeaderFooter = true;
  
  constructor(private router: Router) {
    // Listen to route changes
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      // Hide header and footer on all admin routes
      this.showHeaderFooter = !event.url.includes('/admin');
    });
  }

  ngOnInit(): void {
    // Initial check for admin routes
    this.showHeaderFooter = !this.router.url.includes('/admin');
  }
}
