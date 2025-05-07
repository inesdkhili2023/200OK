import { Component, OnInit } from '@angular/core';
import { FactureService } from '../services/facture.service';
import { Router } from '@angular/router';

interface Facture {
  id: number;
  dateEmission: Date;
  montant: number;
  numFacture: string;
  // Add other properties as needed
}

@Component({
  selector: 'app-factures',
  templateUrl: './factures.component.html',
  styleUrls: ['./factures.component.css']
})
export class FacturesComponent implements OnInit {
  factures: Facture[] = [];
  isLoading = true;
  errorMessage: string | null = null;

  constructor(
    private factureService: FactureService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadFactures();
  }

  loadFactures(): void {
    this.isLoading = true;
    this.errorMessage = null;
    
    this.factureService.getFactures().subscribe({
      next: (data) => {
        this.factures = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur lors de la récupération des factures', error);
        this.errorMessage = 'Impossible de charger les factures. Veuillez réessayer plus tard.';
        this.isLoading = false;
      }
    });
  }

  downloadPdf(id: number): void {
    this.factureService.downloadFacturePdf(id).subscribe({
      next: (pdfData: Blob) => {
        const blob = new Blob([pdfData], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `facture-${id}.pdf`;
        document.body.appendChild(a);
        a.click();
        
        // Cleanup
        setTimeout(() => {
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
        }, 100);
      },
      error: (error) => {
        console.error('Erreur lors du téléchargement', error);
        // Show error to user
      }
    });
  }

  viewFactureDetails(facture: Facture): void {
    this.router.navigate(['/factures', facture.id]);
  }
}