import { Component } from '@angular/core';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';




@Component({
  selector: 'app-ecolia-form',
  standalone: true,
  imports: [ReactiveFormsModule,MatButtonModule,MatInputModule, MatFormFieldModule, MatStepperModule],
   templateUrl: './ecolia-form.component.html',
  styleUrls: ['./ecolia-form.component.css']
})
export class EcoliaFormComponent {

    step1Form: FormGroup;
    step2Form: FormGroup;
  
    constructor(private fb: FormBuilder) {
      this.step1Form = this.fb.group({
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        phone: ['', Validators.required]
      });
  
      this.step2Form = this.fb.group({
        address: ['', Validators.required],
        country: ['', Validators.required]
      });
    }
  
    submitForm() {
      if (this.step1Form.valid && this.step2Form.valid) {
        console.log('Step 1:', this.step1Form.value);
        console.log('Step 2:', this.step2Form.value);
        alert('Form submitted successfully!');
      } else {
        alert('Please complete all steps.');
      }
    }
  }


