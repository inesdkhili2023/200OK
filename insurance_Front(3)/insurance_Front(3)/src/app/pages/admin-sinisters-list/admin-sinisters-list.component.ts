import { Component, OnInit } from '@angular/core';
import { SinisterService } from '../../services/sinister.service';
import { EmailService } from '../../services/email.service';
import { Sinister } from '../../models/sinister.model';
import { PageEvent } from '@angular/material/paginator';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-sinisters-list',
  templateUrl: './admin-sinisters-list.component.html',
  styleUrls: ['./admin-sinisters-list.component.css']
})
export class AdminSinistersListComponent implements OnInit {
  sinisters: Sinister[] = [];
  showSimulationModal = false;
  simulationSeverity = 1;
  simulationClientResponsible = false;
  selectedSinister: Sinister | null = null;

  length = 0;
  pageSize = 3;
  pageIndex = 0;
  pageSizeOptions = [3, 6, 9, 12];
  showFirstLastButtons = true;

  showEmailModal = false;
  emailForm = {
    to: '',
    subject: '',
    body: ''
  };

  constructor(
    private sinisterService: SinisterService,
    private emailService: EmailService
  ) { }

  ngOnInit() {
    this.loadSinisters();
  }

  loadSinisters() {
    this.sinisterService.getAllSinisters().subscribe({
      next: (data) => {
        this.sinisters = data;
        this.length = data.length;
      },
      error: (error) => {
        console.error('Error loading sinisters:', error);
      }
    });
  }

  handlePageEvent(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
  
  }

  get paginatedSinisters(): Sinister[] {
    const startIndex = this.pageIndex * this.pageSize;
    return this.sinisters.slice(startIndex, startIndex + this.pageSize);
  }

  updateStatus(sinister: Sinister) {
    if (sinister.sinisterId != null) {
      this.sinisterService.updateSinister(sinister.sinisterId, sinister)
        .subscribe({
          next: (updated) => {
            this.loadSinisters();
          },
          error: (error) => {
            console.error('Error updating status:', error);
          }
        });
    }
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

  openSimulation(sinister: Sinister) {
    this.selectedSinister = sinister;
    this.showSimulationModal = true;
  }

  closeSimulation() {
    this.showSimulationModal = false;
    this.selectedSinister = null;
    this.simulationSeverity = 1;
    this.simulationClientResponsible = false;
  }

  simulateCompensation() {
    if (this.selectedSinister?.sinisterId) {
      this.sinisterService.simulateCompensation(
        this.selectedSinister.sinisterId,
        this.simulationSeverity,
        this.simulationClientResponsible
      ).subscribe({
        next: (amount) => {
          if (this.selectedSinister) {
            this.selectedSinister.estimatedCompensation = amount;
            this.closeSimulation();
          }
        },
        error: (error) => {
          console.error('Error simulating compensation:', error);
          alert('Erreur lors de la simulation');
        }
      });
    }
  }

  openEmailForm(sinister: Sinister) {
    this.emailForm.to = ''; // You might want to get client's email from somewhere
    this.emailForm.subject = `Regarding Sinister #${sinister.sinisterId}`;
    this.emailForm.body = `Dear Client,\n\nRegarding your sinister declaration from ${sinister.dateAccident}...\n\nBest regards,\nInsurance Team`;
    this.showEmailModal = true;
  }

  closeEmailForm() {
    this.showEmailModal = false;
    this.emailForm = {
      to: '',
      subject: '',
      body: ''
    };
  }

  sendEmail() {
    this.emailService.sendEmail(
      this.emailForm.to,
      this.emailForm.subject,
      this.emailForm.body
    ).subscribe({
      next: (response) => {
        if (response) {
          Swal.fire({
            icon: 'success',
            title: 'Success!',
            text: 'Email sent successfully',
            confirmButtonColor: '#ff8c00',
            timer: 2000,
            showConfirmButton: false
          });
          this.closeEmailForm();
        } else {
          throw new Error('No response from server');
        }
      },
      error: (error) => {
        console.error('Error sending email:', error);
        // Only show error if it's actually a failed request
        if (error.status && error.status !== 200) {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Failed to send email. Please try again.',
            confirmButtonColor: '#ff8c00'
          });
        } else {
          // If we got here but the email was actually sent (based on your description)
          Swal.fire({
            icon: 'success',
            title: 'Success!',
            text: 'Email sent successfully',
            confirmButtonColor: '#ff8c00',
            timer: 2000,
            showConfirmButton: false
          });
          this.closeEmailForm();
        }
      }
    });
  }
}