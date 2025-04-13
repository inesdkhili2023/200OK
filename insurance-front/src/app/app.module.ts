import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { BlogComponent } from './pages/blog/blog.component';
import { BlogDetailsComponent } from './pages/blog-details/blog-details.component';
import { ContactUsComponent } from './pages/contact-us/contact-us.component';
import { NavBarComponent } from './pages/nav-bar/nav-bar.component';
import { FooterComponent } from './pages/footer/footer.component';
import { DashboardAdminComponent } from './dashboard-admin/dashboard-admin.component';
import { InsurancesComponent } from './pages/insurances/insurances.component';
import { FormsModule ,ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { ReservationComponent } from './reservation/reservation.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCardModule } from '@angular/material/card';
import { JobOfferManagementComponent } from './job-offer-management/job-offer-management.component';
import { PolitiqueRHComponent } from './politique-rh/politique-rh.component';
import { JobOfferComponent } from './job-offer/job-offer.component';
import { CandidatureSComponent } from './candidature-s/candidature-s.component';
import { JobApplicationFormComponent } from './job-application-form/job-application-form.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { FullCalendarModule } from '@fullcalendar/angular';
import { JobOfferDetailsComponent } from './job-offer-details/job-offer-details.component';
import {  MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { AddJobComponent } from './add-job/add-job.component';
import { AvailabilityComponent } from './availability/availability.component';
import { AvailabilityService } from './services/availability.service';
import { JobOfferAdminComponent } from './job-offer-admin/job-offer-admin.component';
import { MatPaginatorModule } from '@angular/material/paginator'; // <-- Importer MatPaginatorModule
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { AppointmentManagementComponent } from './appointment-management/appointment-management.component';
import { MatTableDataSource } from '@angular/material/table';
import { JobOfferEditComponent } from './job-offer-edit/job-offer-edit.component';
import { JobAppAdminComponent } from './job-app-admin/job-app-admin.component';
import { RecaptchaModule, RecaptchaFormsModule  } from 'ng-recaptcha';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { format } from 'date-fns';
import { AvailabilityAdminComponent } from './availability-admin/availability-admin.component';
import { WeatherComponent } from './weather/weather.component';
import { AvailabilityEditComponent } from './availability-edit/availability-edit.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    BlogComponent,
    BlogDetailsComponent,
    ContactUsComponent,
    NavBarComponent,
    FooterComponent,
    DashboardAdminComponent,
    InsurancesComponent ,
    JobOfferManagementComponent,
    PolitiqueRHComponent,
    JobOfferComponent,
    CandidatureSComponent,
    JobApplicationFormComponent,
    ReservationComponent,
    JobOfferDetailsComponent,
    AddJobComponent,
    AvailabilityComponent,
    JobOfferAdminComponent,
    AppointmentManagementComponent,
    JobOfferEditComponent,
    JobAppAdminComponent,
    AvailabilityAdminComponent,
    WeatherComponent,
    AvailabilityEditComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatCardModule,
    MatIconModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule
    ,MatSelectModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonToggleModule,
    MatMenuModule,
    FullCalendarModule,CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatPaginatorModule,
    MatTableModule,
    MatSortModule,
    RecaptchaModule,
    RecaptchaFormsModule,
    MatProgressBarModule,
    NgxMaterialTimepickerModule,
    MatSnackBarModule
    
    
  ],
  providers: [AvailabilityService],
  bootstrap: [AppComponent]
})
export class AppModule { }
