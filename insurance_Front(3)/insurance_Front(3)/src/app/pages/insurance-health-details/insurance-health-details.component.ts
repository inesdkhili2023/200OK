import { Component } from '@angular/core';
import { PdfService } from '../../services/pdf.service';

@Component({
  selector: 'app-insurance-health-details',
  templateUrl: './insurance-health-details.component.html',
  styleUrls: ['./insurance-health-details.component.css']
})
export class InsuranceHealthDetailsComponent {
  constructor(private pdfService: PdfService) {}

  downloadPDF() {
    this.pdfService.generatePDF('pdfContent', 'health-insurance-details.pdf');
  }
}
