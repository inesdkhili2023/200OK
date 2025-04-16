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
  showHeaderFooter = true;

  constructor(private router: Router) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      // Check if current URL is an admin page or a page that uses the main layout
      const isAdminPage = event.url.includes('/admin/');
      const isMainLayoutPage = [
        '/claim-admin',
        '/claim-list',
        '/agency',
        '/agency-list',
        '/agent-list',
        '/insurances',
        '/rating-list'
      ].some(path => event.url.includes(path));
      
      this.showHeaderFooter = !(isAdminPage || isMainLayoutPage);
    });
  }
}