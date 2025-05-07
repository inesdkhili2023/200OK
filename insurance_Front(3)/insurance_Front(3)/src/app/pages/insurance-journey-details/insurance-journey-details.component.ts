import { Component } from '@angular/core';
import { PdfService } from '../../services/pdf.service';

@Component({
  selector: 'app-insurance-journey-details',
  templateUrl: './insurance-journey-details.component.html',
  styleUrls: ['./insurance-journey-details.component.css']
})
export class InsuranceJourneyDetailsComponent {
  constructor(private pdfService: PdfService) {}

  downloadPDF() {
    this.pdfService.generatePDF('pdfContent', 'journey-insurance-details.pdf');
  }
}
