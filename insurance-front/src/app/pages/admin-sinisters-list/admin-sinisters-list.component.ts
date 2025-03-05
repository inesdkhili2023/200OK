import { Component, OnInit } from '@angular/core';
import { SinisterService } from '../../services/sinister.service';

@Component({
  selector: 'app-admin-sinisters-list',
  templateUrl: './admin-sinisters-list.component.html',
  styleUrls: ['./admin-sinisters-list.component.css']
})
export class AdminSinistersListComponent implements OnInit {
  sinisters: any[] = [];

  constructor(private sinisterService: SinisterService) { }

  ngOnInit() {
    this.loadSinisters();
  }

  loadSinisters() {
    this.sinisterService.getAllSinisters().subscribe({
      next: (data) => {
        this.sinisters = data;
      },
      error: (error) => {
        console.error('Error loading sinisters:', error);
      }
    });
  }
}