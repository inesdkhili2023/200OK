import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Towing } from '../../models/towing.model';
import { TowingService } from '../../services/towing.service';
import * as moment from 'moment'; // ✅ Correct import

@Component({
  selector: 'app-towing',
  templateUrl: './towing.component.html',
  styleUrls: ['./towing.component.css']
})
export class TowingComponent implements OnInit {
  towings: Towing[] = [];
  agents: any[] = [];
  users: any[] = [];
  selectedTowing: Towing | null = null;
  page: number = 1; 
  newTowing: Towing = {
    idUser: 0,
    idAgent: 0,
    requestDate: '',
    status: 'Pending',
    location: '', latitude: 0,   // ✅ Added default latitude
    longitude: 0 
  };

  constructor(private towingService: TowingService, private http: HttpClient) {}

  ngOnInit(): void {
    this.loadTowings();
    this.loadAgents();
    this.loadUsers();
  }

  loadTowings(): void {
    this.towingService.getAllTowings().subscribe(
      (data: Towing[]) => { this.towings = data; },
      (error: any) => { console.error('Error loading towings:', error); }
    );
  }

  loadAgents(): void {
    this.towingService.getAgents().subscribe(
      (data: any[]) => { this.agents = data; },
      (error: any) => { console.error('Error loading agents:', error); }
    );
  }

  loadUsers(): void {
    this.towingService.getUsers().subscribe(
      (data: any[]) => { this.users = data; },
      (error: any) => { console.error('Error loading users:', error); }
    );
  }

  getAgentName(towing: Towing): string {
    return towing.agent ? towing.agent.name : 'N/A';
  }
  
  getUserName(towing: Towing): string {
    return towing.user ? towing.user.name : 'N/A';
  }
  
  editTowing(towing: Towing): void {
    this.selectedTowing = { ...towing };
  }

  updateTowing(): void {
    if (!this.selectedTowing || !this.selectedTowing.id) {
        console.error("Error: No towing selected for update.");
        return;
    }

    this.towingService.updateTowing(this.selectedTowing).subscribe(
        (updatedTowing) => {
            console.log('✅ Towing updated successfully:', updatedTowing);
            this.loadTowings(); // Reload the list
            this.selectedTowing = null; // Reset selection
        },
        (error) => {
            console.error('❌ Error updating towing:', error);
        }
    );
}


  getFormattedDate(dateString: string): string {
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? 'Invalid Date' : date.toISOString();
  }

  createTowing(): void {
    if (!this.newTowing.idAgent || !this.newTowing.idUser) {
        console.error("Error: Please select both an agent and a user before submitting.");
        return;
    }

    if (!this.newTowing.requestDate) {
        console.error("Invalid date format. Please select a valid date.");
        return;
    }

    // ✅ Convert `requestDate` to a proper format for backend (YYYY-MM-DD HH:mm:ss)
    const formattedDate = moment(this.newTowing.requestDate, "YYYY-MM-DDTHH:mm", true);

    if (!formattedDate.isValid()) {
        console.error("Invalid date. Please enter a valid date.");
        return;
    }

    const towingData = {
        id: this.newTowing.id || undefined,
        status: this.newTowing.status || 'Pending',
        location: this.newTowing.location,
        requestDate: formattedDate.format("YYYY-MM-DD HH:mm:ss"), // ✅ Correct format
        idAgent: Number(this.newTowing.idAgent), 
        idUser: Number(this.newTowing.idUser)
    };

    console.log("🚀 Sending towing data:", towingData);

    this.towingService.addTowing(towingData).subscribe(
        (data) => {
            console.log('✅ Towing added successfully:', data);
            this.loadTowings();
        },
        (error) => {
            console.error('❌ Error adding towing:', error);
        }
    );
}


  cancelEdit(): void {
    this.selectedTowing = null;
  }

  deleteTowing(id: number): void {
    this.towingService.deleteTowing(id).subscribe(
      (response) => {
        console.log("✅ Success:", response.message); // ✅ Log success message
        this.loadTowings(); // Reload towings list
      },
      (error) => {
        console.error("❌ Error deleting towing:", error);
      }
    );
  }
  

}
