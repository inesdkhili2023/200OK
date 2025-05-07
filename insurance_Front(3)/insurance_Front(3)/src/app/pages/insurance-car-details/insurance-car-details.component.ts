import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { InsuranceService } from '../../services/insurance.service';
import { RouterModule } from '@angular/router';
import { PdfService } from '../../services/pdf.service';

@Component({
  selector: 'app-insurance-car-details',
  templateUrl: './insurance-car-details.component.html',
  styleUrls: ['./insurance-car-details.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class InsuranceCarDetailsComponent implements OnInit {
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
    this.pdfService.generatePDF('pdfContent', 'car-insurance-details.pdf');
  }
}
