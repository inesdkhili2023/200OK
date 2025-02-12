import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent  {
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

  nextImage(): void {
    this.currentImageIndex = (this.currentImageIndex + 1) % this.images.length;
  }}