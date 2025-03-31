
import { Component, OnInit } from '@angular/core';
import { ContratService } from '../services/contrat.service';

@Component({
  selector: 'app-contrats',
  templateUrl: './contrats.component.html',
  styleUrls: ['./contrats.component.css']
})
export class ContratsComponent implements OnInit {
  contrats: any[] = [];

  constructor(private contratService: ContratService) {}

  ngOnInit() {
    this.getContrats();
  }

  getContrats() {
    this.contratService.getContrats().subscribe(data => {
      this.contrats = data;
    }, error => {
      console.error('Erreur lors de la récupération des contrats:', error);
    });
  }

  downloadPdf(id: number) {
    this.contratService.getContratPdf(id).subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `contrat-${id}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }, error => {
      console.error('Erreur lors du téléchargement du PDF:', error);
    });
  }
}





