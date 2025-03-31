import { Component, OnInit } from '@angular/core';
import { FactureService } from '../services/facture.service';  // Importez le service
import { Router } from '@angular/router';

@Component({
  selector: 'app-factures',
  templateUrl: './factures.component.html',
  styleUrls: ['./factures.component.css']
})
export class FacturesComponent implements OnInit {

  factures: any[] = [];  // Tableau pour stocker les factures

  constructor(private factureService: FactureService, private router: Router) { }

  ngOnInit(): void {
    // Appel du service pour récupérer les factures
    this.factureService.getFactures().subscribe(
      (data) => {
        this.factures = data;  // Stocker les données dans le tableau 'factures'
      },
      (error) => {
        console.error('Erreur lors de la récupération des factures', error);
      }
    );
  }
   // Méthode viewFacture
   viewFacture(id: number): void {
    console.log('Voir détails de la facture avec ID:', id);
    // Vous pouvez rediriger ou afficher un modal pour voir les détails de la facture
  }
  downloadPdf(id: number): void {
    this.factureService.downloadFacturePdf(id).subscribe((pdfData: Blob) => {
      const blob = new Blob([pdfData], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `facture-${id}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    });
  }
}
