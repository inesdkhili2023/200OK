import { Component } from '@angular/core';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent {
  categories = [
    { name: 'House Insurance', count: 11 },
    { name: 'Travel Insurance', count: 16 },
    { name: 'Life Insurance', count: 16 },
    { name: 'Car Insurance', count: 19 },
    { name: 'Business Insurance', count: 22 },
    { name: 'Marketing', count: 25 },
  ];

}
