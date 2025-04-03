import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { BlogComponent } from './pages/blog/blog.component';
import { BlogDetailsComponent } from './pages/blog-details/blog-details.component';
import { ContactUsComponent } from './pages/contact-us/contact-us.component';
import { DashboardAdminComponent } from './dashboard-admin/dashboard-admin.component';
import { InsurancesComponent } from './pages/insurances/insurances.component';
import { JobOfferManagementComponent } from './job-offer-management/job-offer-management.component';
import { PolitiqueRHComponent } from './politique-rh/politique-rh.component';
import { JobOfferComponent } from './job-offer/job-offer.component';
import { CandidatureSComponent } from './candidature-s/candidature-s.component';
import { JobApplicationFormComponent } from './job-application-form/job-application-form.component';
import { ReservationComponent } from './reservation/reservation.component';
import { AddJobComponent } from './add-job/add-job.component';
import { AvailabilityComponent } from './availability/availability.component';
import { JobOfferAdminComponent } from './job-offer-admin/job-offer-admin.component';
import { AppointmentManagementComponent } from './appointment-management/appointment-management.component';
import { JobAppAdminComponent } from './job-app-admin/job-app-admin.component';
import { AvailabilityAdminComponent } from './availability-admin/availability-admin.component';
const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'blog', component: BlogComponent },
  { path: 'blog-details', component: BlogDetailsComponent },
  { path: 'contact-us', component: ContactUsComponent },
  { path: 'admin/dashboard', component: DashboardAdminComponent },
  { path: 'insurances', component: InsurancesComponent },
  { path: 'joinus', component: JobOfferManagementComponent },
  { path: 'politique', component: PolitiqueRHComponent },
  { path: 'joboffer', component: JobOfferComponent },
  { path: 'candidS', component: CandidatureSComponent },
  { path: 'jobApp/:id', component: JobApplicationFormComponent },
  { path: 'jobApp', component: JobApplicationFormComponent },
  { path: 'reservation', component: ReservationComponent },
  { path: 'jobAdd', component: AddJobComponent },
  { path: 'Rendez-vous', component: AvailabilityComponent },
  { path: 'jobManagement', component: JobOfferAdminComponent },
  { path: 'appointmentManagement', component: AppointmentManagementComponent },
  { path: 'jobAppAdmin', component: JobAppAdminComponent },
  { path: 'DisponibiliteAdmin', component: AvailabilityAdminComponent },


  { path: '**', redirectTo: 'home' } 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }