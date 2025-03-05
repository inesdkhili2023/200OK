import { Component, OnInit } from '@angular/core';
import { InsuranceService } from '../../services/insurance.service';  // adjust path if needed

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  currentImageIndex = 0;
  images = [
    {
      src: '/assets/images/slider-img.jpg',
      title: 'Health Insurance',
      category: 'Healthcare',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris hendrerit fringilla ligula, nec congue leo pharetra in.'
    },
    {
      src: '/assets/images/slider-img1.jpg',
      title: 'Life Insurance',
      category: 'Lifecare',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris hendrerit fringilla ligula, nec congue leo pharetra in.'
    },
    {
      src: '/assets/images/slider-img2.jpg',
      title: 'Travel Insurance',
      category: 'Healthcare',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris hendrerit fringilla ligula, nec congue leo pharetra in.'
    }
  ];

  insurances: any[] = [];

  constructor(private insuranceService: InsuranceService) { }

  ngOnInit(): void {
    this.fetchInsurances();
  }

  fetchInsurances() {
    this.insuranceService.getAllInsurances().subscribe(data => {
      this.insurances = data;
    });
  }

  nextImage(): void {
    this.currentImageIndex = (this.currentImageIndex + 1) % this.images.length;
  }
}