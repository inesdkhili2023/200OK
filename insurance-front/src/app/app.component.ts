import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  showHeaderFooter = true;

  constructor(private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const hiddenRoutes = [
          '/admin/dashboard',
          '/dashboard',
          '/agent/dashboard'
        ];

        this.showHeaderFooter = !hiddenRoutes.some(route => event.url.includes(route));
      }
    });
  }
}
