import { Component, OnInit, ViewChild } from '@angular/core';
import { SinisterService } from '../../services/sinister.service';
import { Sinister } from '../../models/sinister.model';
import { SinisterType } from '../../models/sinister-type.enum';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapLocationComponent } from '../map-location/map-location.component';

@Component({
  selector: 'app-sinisters',
  templateUrl: './sinisters.component.html',
  styleUrls: ['./sinisters.component.css']
})
export class SinistersComponent implements OnInit {
  sinisters: Sinister[] = [];
  sinisterTypes = Object.values(SinisterType);
  
  newSinister: Sinister = {
    dateAccident: new Date(),
    dateDeclaration: new Date(),
    accidentLocation: '',
    typeSinister: SinisterType.CAR,
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
  selectedFile: File | null = null;
  showMap: boolean = false;
  currentLocationInput: 'new' | 'edit' = 'new';
  showDeleteDialog: boolean = false;
  showDeleteSuccess: boolean = false;
  sinisterToDelete: number | null = null;

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

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
      if (!allowedTypes.includes(file.type)) {
        alert('Please select a PDF or image file.');
        event.target.value = '';
        return;
      }

      // Validate file size (e.g., 5MB max)
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        alert('File size must be less than 5MB');
        event.target.value = '';
        return;
      }

      this.selectedFile = file;
      console.log('File selected:', file.name);
    }
  }

  createSinister() {
    this.submitted = true;
    if (!this.validateSinister(this.newSinister)) {
      return;
    }

    console.log('Creating sinister with file:', this.selectedFile);
    this.sinisterService.createSinister(this.newSinister, this.selectedFile || undefined)
      .subscribe({
        next: (response) => {
          console.log('Sinister created successfully:', response);
          this.loadSinisters();
          this.resetForm();
        },
        error: (error) => {
          console.error('Error details:', error);
          alert('Error creating sinister. Please try again.');
        }
      });
  }

  updateSinister() {
    this.editSubmitted = true;
    if (!this.validateSinister(this.selectedSinister)) {
      return;
    }

    if (this.selectedSinister.sinisterId) {
      const sinisterToUpdate = {
        ...this.selectedSinister,
        dateAccident: new Date(this.selectedSinister.dateAccident),
        dateDeclaration: new Date(this.selectedSinister.dateDeclaration),
        status: this.selectedSinister.status || 'IN_PROGRESS'
      };

      console.log('Sending update:', {
        id: this.selectedSinister.sinisterId,
        data: sinisterToUpdate,
        fileInfo: this.selectedFile ? {
          name: this.selectedFile.name,
          type: this.selectedFile.type,
          size: this.selectedFile.size
        } : 'No file'
      });

      this.sinisterService.updateSinister(
        this.selectedSinister.sinisterId,
        sinisterToUpdate,
        this.selectedFile || undefined
      ).subscribe({
        next: (response) => {
          console.log('Update successful:', response);
          this.loadSinisters();
          this.cancelEdit();
          this.selectedFile = null;
        },
        error: (error) => {
          console.error('Update error details:', error);
          if (error.status === 400) {
            alert(`Erreur de données: ${error.error?.message || 'Format invalide'}`);
          } else {
            alert(`Erreur lors de la mise à jour: ${error.message || 'Erreur inconnue'}`);
          }
        }
      });
    }
  }

  deleteSinister(id: number) {
    this.sinisterToDelete = id;
    this.showDeleteDialog = true;
  }

  cancelDelete() {
    this.showDeleteDialog = false;
    this.sinisterToDelete = null;
  }

  confirmDelete() {
    if (this.sinisterToDelete) {
      this.sinisterService.deleteSinister(this.sinisterToDelete).subscribe(
        () => {
          this.showDeleteDialog = false;
          this.showDeleteSuccess = true;
          this.loadSinisters();
         
          setTimeout(() => {
            this.showDeleteSuccess = false;
          }, 3000);
        },
        error => {
          console.error('Error deleting sinister:', error);
        }
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

  viewFile(attachmentPath: string | undefined) {
    if (!attachmentPath) {
      alert('No file attached');
      return;
    }

    this.sinisterService.getFile(attachmentPath).subscribe({
      next: (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const contentType = blob.type;

        if (contentType.includes('pdf')) {
          window.open(url, '_blank');
        } else if (contentType.includes('image')) {
          const img = new Image();
          img.src = url;
          const w = window.open("");
          w?.document.write(img.outerHTML);
        } else {
          console.error('Unsupported file type');
          alert('Unsupported file type');
        }
      },
      error: (error) => {
        console.error('Error viewing file:', error);
        alert('Error viewing file. The file might not exist.');
      }
    });
  }

  openMap(type: 'new' | 'edit'): void {
    this.showMap = true;
    this.currentLocationInput = type;
  }

  onLocationSelected(location: { latitude: number; longitude: number }): void {
    const locationString = `${location.latitude}, ${location.longitude}`;
    
    if (this.currentLocationInput === 'new') {
      this.newSinister.accidentLocation = locationString;
    } else if (this.selectedSinister.sinisterId) {
      // Update location in backend when editing
      this.sinisterService.updateSinisterLocation(
        this.selectedSinister.sinisterId,
        location.latitude,
        location.longitude
      ).subscribe({
        next: (updatedSinister) => {
          this.selectedSinister.accidentLocation = locationString;
          console.log('Location updated successfully:', updatedSinister);
        },
        error: (error) => {
          console.error('Error updating location:', error);
          alert('Error updating location. Please try again.');
        }
      });
    }
    
    this.showMap = false;
  }

  private resetForm() {
    this.newSinister = {
      dateAccident: new Date(),
      dateDeclaration: new Date(),
      accidentLocation: '',
      typeSinister: SinisterType.CAR,
      description: '',
      status: 'IN_PROGRESS'
    };
    this.submitted = false;
    this.selectedFile = null;
  }
}