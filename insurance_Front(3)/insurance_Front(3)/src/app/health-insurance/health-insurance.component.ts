import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup,  ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-health-insurance',
  standalone: true,
  imports: [CommonModule,CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './health-insurance.component.html',
  styleUrls: ['./health-insurance.component.css']
})
export class HealthInsuranceComponent {
  form: FormGroup;
  tarif: number | null = null;
  submitted = false;

  constructor(private fb: FormBuilder, private http: HttpClient, private toast:ToastrService) {
    this.form = this.fb.group({
      nom: ['', Validators.required],
      age: ['', [Validators.required, Validators.min(1)]],
      profession: ['', Validators.required],
      antecedents: ['non', Validators.required],
      couverture: ['base', Validators.required]
    });
  }

  onSubmit() {
    if (this.form.invalid) return;

    const formData = this.form.value;

    this.http.post<any>('http://127.0.0.1:5000/api/devis', formData).subscribe({
      next: (response) => {
        this.tarif = response.tarif;
        this.submitted = true;
        alert('✅ Devis envoyé avec succès.');
      },
      error: (err) => {
        console.error(err);
        alert('❌ Une erreur est survenue.');
      }
    });
  }
}
