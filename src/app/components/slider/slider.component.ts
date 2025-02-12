import { Component } from '@angular/core';

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.css']
})
export class SliderComponent {
  slides = [
    { image: 'assets/images/slider-img.jpg', title: 'Healthcare', subtitle: 'Health Insurance', text: 'Lorem ipsum dolor sit amet...' },
    { image: 'assets/images/slider-img1.jpg', title: 'Lifecare', subtitle: 'Life Insurance', text: 'Mauris hendrerit fringilla ligula...' },
    { image: 'assets/images/slider-img2.jpg', title: 'Healthcare', subtitle: 'Travel Insurance', text: 'Nec congue leo pharetra in...' }
  ];

}
