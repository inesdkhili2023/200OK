import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.css']
})
export class AdminLayoutComponent implements OnInit {
  
  constructor(
    private router: Router,
    private usersService: UsersService
  ) {}

  ngOnInit(): void {
    // Check if user is admin, redirect if not
    if (!this.usersService.isAdmin()) {
      this.router.navigate(['/login']);
    }
  }
} 