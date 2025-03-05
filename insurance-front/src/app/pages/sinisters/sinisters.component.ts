import { Component, OnInit } from '@angular/core';
import { SinisterService } from '../../services/sinister.service';
import { Sinister } from '../../models/sinister.model';

@Component({
  selector: 'app-sinisters',
  templateUrl: './sinisters.component.html',
  styleUrls: ['./sinisters.component.css']
})
export class SinistersComponent implements OnInit {
  sinisters: Sinister[] = [];
  newSinister: Sinister = {
    dateAccident: new Date(),
    dateDeclaration: new Date(),
    accidentLocation: '',
    typeSinister: '',
    description: '',
    status: 'IN_PROGRESS'
  };
  selectedSinister: Sinister = {} as Sinister;
  isEditing: boolean = false;
  submitted = false;
  editSubmitted = false;
  formErrors = {
    accidentLocation: '',
    typeSinister: '',
    dateAccident: '',
    dateDeclaration: '',
    description: ''
  };

  constructor(private sinisterService: SinisterService) {}

  ngOnInit() {
    this.loadSinisters();
  }

  validateSinister(sinister: Sinister): boolean {
    let isValid = true;
    // Reset errors
    this.formErrors = {
      accidentLocation: '',
      typeSinister: '',
      dateAccident: '',
      dateDeclaration: '',
      description: ''
    };

    if (!sinister.accidentLocation || sinister.accidentLocation.trim().length < 3) {
      this.formErrors.accidentLocation = 'Accident location must be at least 3 characters';
      isValid = false;
    }

    if (!sinister.typeSinister || sinister.typeSinister.trim().length < 3) {
      this.formErrors.typeSinister = 'Type must be at least 3 characters';
      isValid = false;
    }

    if (!sinister.dateAccident) {
      this.formErrors.dateAccident = 'Accident date is required';
      isValid = false;
    }

    if (!sinister.dateDeclaration) {
      this.formErrors.dateDeclaration = 'Declaration date is required';
      isValid = false;
    } else if (sinister.dateAccident && new Date(sinister.dateAccident) >= new Date(sinister.dateDeclaration)) {
      this.formErrors.dateDeclaration = 'Declaration date must be after accident date';
      isValid = false;
    }

    if (!sinister.description || sinister.description.trim().length < 10) {
      this.formErrors.description = 'Description must be at least 10 characters';
      isValid = false;
    }

    return isValid;
  }

  loadSinisters() {
    this.sinisterService.getAllSinisters().subscribe(
      data => this.sinisters = data,
      error => console.error('Error loading sinisters:', error)
    );
  }

  createSinister() {
    this.submitted = true;
    if (!this.validateSinister(this.newSinister)) {
      return;
    }
    this.sinisterService.createSinister(this.newSinister).subscribe(
      () => {
        this.loadSinisters();
        this.resetForm();
      },
      error => console.error('Error creating sinister:', error)
    );
  }

  updateSinister() {
    this.editSubmitted = true;
    if (!this.validateSinister(this.selectedSinister)) {
      return;
    }
    if (this.selectedSinister.sinisterId) {
      this.sinisterService.updateSinister(
        this.selectedSinister.sinisterId,
        this.selectedSinister
      ).subscribe(
        () => {
          this.loadSinisters();
          this.cancelEdit();
        },
        error => console.error('Error updating sinister:', error)
      );
    }
  }

  deleteSinister(id: number) {
    if (confirm('Are you sure you want to delete this sinister?')) {
      this.sinisterService.deleteSinister(id).subscribe(
        () => this.loadSinisters(),
        error => console.error('Error deleting sinister:', error)
      );
    }
  }

  editSinister(sinister: Sinister) {
    this.selectedSinister = { ...sinister };
    this.isEditing = true;
    this.editSubmitted = false;
  }

  cancelEdit() {
    this.isEditing = false;
    this.editSubmitted = false;
    this.selectedSinister = {} as Sinister;
  }

  private resetForm() {
    this.newSinister = {
      dateAccident: new Date(),
      dateDeclaration: new Date(),
      accidentLocation: '',
      typeSinister: '',
      description: '',
      status: 'IN_PROGRESS'
    };
    this.submitted = false;
  }
}