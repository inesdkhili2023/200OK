import { Component } from '@angular/core';
import { Location } from '@angular/common';
@Component({
  selector: 'app-politique-rh',
  templateUrl: './politique-rh.component.html',
  styleUrls: ['./politique-rh.component.css']
})
export class PolitiqueRHComponent {
  constructor(private location: Location) {}

  closeForm(): void {
    this.location.back(); 
  }
}
