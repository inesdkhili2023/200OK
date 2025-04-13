import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NotificationBellComponent } from '../pages/notification/notification-bell.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard-admin',
  templateUrl: './dashboard-admin.component.html',
  styleUrls: ['./dashboard-admin.component.css'],
  imports: [
    CommonModule,
    RouterModule,
    NotificationBellComponent
  ],
  standalone: true
})
export class DashboardAdminComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {
    // Nothing to initialize in the wrapper component
  }
}