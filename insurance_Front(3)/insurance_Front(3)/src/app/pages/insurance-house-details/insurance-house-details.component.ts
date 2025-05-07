import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { InsuranceService } from '../../services/insurance.service';
import { PdfService } from '../../services/pdf.service';

@Component({
  selector: 'app-insurance-house-details',
  templateUrl: './insurance-house-details.component.html',
  styleUrls: ['./insurance-house-details.component.css'],
  imports: [CommonModule],
  standalone: true
})
export class InsuranceHouseDetailsComponent implements OnInit {
  insurance: any = {};

  constructor(
    private route: ActivatedRoute,
    private insuranceService: InsuranceService,
    private pdfService: PdfService
  ) { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.insuranceService.getInsuranceById(id).subscribe(data => {
        this.insurance = data;
      });
    }
  }

  downloadPDF() {
    this.pdfService.generatePDF('pdfContent', 'house-insurance-details.pdf');
  }
}
