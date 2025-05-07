import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { BlogComponent } from './pages/blog/blog.component';
import { BlogDetailsComponent } from './pages/blog-details/blog-details.component';
import { ContactUsComponent } from './pages/contact-us/contact-us.component';
import { DashboardAdminComponent } from './dashboard-admin/dashboard-admin.component';
import { InsurancesComponent } from './pages/insurances/insurances.component';
import { ClaimComponent } from './pages/claim/claim.component';
import { ClaimListComponent } from './pages/claim-list/claim-list.component';
import { ClaimAdminComponent } from './pages/claim-admin/claim-admin.component';
import { AgencyComponent } from './pages/agency/agency.component';
import { AgencyListComponent } from './pages/agency-list/agency-list.component';
import { MapComponent } from './pages/map/map.component';
import { AgentListComponent } from './pages/agent-list/agent-list.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { RatingListComponent } from './components/rating-list/rating-list.component';
import { LoginComponent } from './user/login/login.component';
import { RegisterComponent } from './user/register/register.component';
import { ProfileComponent } from './user/profile/profile.component';
import { UpdateUserComponent } from './user/update-user/update-user.component';
import { UserListComponent } from './user/user-list/user-list.component';
import { SignupComponent } from './user/signup/signup.component';
import { SendemailComponent } from './user/sendemail/sendemail.component';
import { ResetpasswordComponent } from './user/resetpassword/resetpassword.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LogingoogleComponent } from './user/logingoogle/logingoogle.component';
import { LoginAttentanceComponent } from './user/login-attentance/login-attentance.component';
import { FaceDetectionComponent } from './user/face-detection/face-detection.component';
import { FaceDetectionGuard } from './guards/face-detection.guard';
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { UserLayoutComponent } from './layouts/user-layout/user-layout.component';
import { AgentLayoutComponent } from './layouts/agent-layout/agent-layout.component';
import { DashboardAgentComponent } from './dashboard-agent/dashboard-agent.component';
import { JobOfferAdminComponent } from './job-offer-admin/job-offer-admin.component';
import { JobAppAdminComponent } from './job-app-admin/job-app-admin.component';
import { AvailabilityAdminComponent } from './availability-admin/availability-admin.component';
import { AppointmentManagementComponent } from './appointment-management/appointment-management.component';
import { JobOfferManagementComponent } from './job-offer-management/job-offer-management.component';
import { PolitiqueRHComponent } from './politique-rh/politique-rh.component';
import { JobOfferComponent } from './job-offer/job-offer.component';
import { CandidatureSComponent } from './candidature-s/candidature-s.component';
import { JobApplicationFormComponent } from './job-application-form/job-application-form.component';
import { AddJobComponent } from './add-job/add-job.component';
import { AvailabilityComponent } from './availability/availability.component';
import { ReservationComponent } from './reservation/reservation.component';
import { AdminSinistersListComponent } from './pages/admin-sinisters-list/admin-sinisters-list.component';
import { InsuranceFormComponent } from './pages/insurance-form/insurance-form.component';
import { SinistersComponent } from './pages/sinisters/sinisters.component';
import { InsuranceCarDetailsComponent } from './pages/insurance-car-details/insurance-car-details.component';
import { InsuranceHouseDetailsComponent } from './pages/insurance-house-details/insurance-house-details.component';
import { InsuranceHealthDetailsComponent } from './pages/insurance-health-details/insurance-health-details.component';
import { InsuranceJourneyDetailsComponent } from './pages/insurance-journey-details/insurance-journey-details.component';
import { InsuranceAdminComponent } from './insurance-admin/insurance-admin.component';
import { TowingComponent } from './pages/towing/towing.component';
import { ChatComponent } from './pages/chat/chat.component';
import { NotificationBellComponent } from './pages/notification/notification-bell.component';
import { RecommendationComponent } from './pages/recommendation/recommendation.component';
import { AdminMessagesComponent } from './dashboard-admin/admin-messages/admin-messages.component';
import { AllNotificationsComponent } from './pages/all-notifications/all-notifications.component';
import { AllMessagesComponent } from './pages/all-messages/all-messages.component';
import { AgentTowingComponent } from './pages/agent-towing/agent-towing.component';
import { EmergencyTowingComponent } from './pages/emergency-towing/emergency-towing.component';
import { ContratsComponent } from './contrats/contrats.component';
import { FacturesComponent } from './factures/factures.component';
import { PaymentComponent } from './pages/payment/payment.component';
import { AssuranceVoyageFormComponent } from './forms/assurance-voyage-form/assurance-voyage-form.component';
import { PaymentSuccessComponent } from './payment-success/payment-success.component';
import { EcoliaFormComponent } from './forms/ecolia-form/ecolia-form.component';
import { AssuranceHabitationFormComponent } from './forms/assurance-habitation-form/assurance-habitation-form.component';
import { AssuranceAccidentsFormComponent } from './forms/assurance-accidents-form/assurance-accidents-form.component';
import { SacreCapitalisationFormComponent } from './forms/sacre-capitalisation-form/sacre-capitalisation-form.component';
import { SanteFormComponent } from './forms/sante-form/sante-form.component';
import { AssuranceDevisComponent } from './pages/assurance-devis/assurance-devis.component';
import { HealthInsuranceComponent } from './health-insurance/health-insurance.component';

const routes: Routes = [
  // Public routes without sidebar
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
{ path: 'blog', component: BlogComponent, canActivate: [AuthGuard] },
{ path: 'blog-details', component: BlogDetailsComponent, canActivate: [AuthGuard] },
{ path: 'contact-us', component: ContactUsComponent, canActivate: [AuthGuard] },
//{ path: 'insurances', component: InsurancesComponent, canActivate: [AuthGuard] },
{ path: 'login', component: LoginComponent, canActivate: [AuthGuard] },
{ path: 'signup', component: SignupComponent, canActivate: [FaceDetectionGuard, AuthGuard] },
{ path: 'sendemail', component: SendemailComponent, canActivate: [AuthGuard] },
{ path: 'google', component: LogingoogleComponent, canActivate: [AuthGuard] },
{ path: 'resetpassword', component: ResetpasswordComponent, canActivate: [AuthGuard] },
{ path: 'detect-face', component: FaceDetectionComponent, canActivate: [AuthGuard] },
{ path: 'loginface', component: LoginAttentanceComponent, canActivate: [AuthGuard] },
{ path: 'joinus', component: JobOfferManagementComponent },
{ path: 'politique', component: PolitiqueRHComponent },
{ path: 'joboffer', component: JobOfferComponent },
{ path: 'candidS', component: CandidatureSComponent},
{ path: 'jobApp/:id', component: JobApplicationFormComponent},
{ path: 'jobApp', component: JobApplicationFormComponent },
{ path: 'Rendez-vous', component: AvailabilityComponent },
{ path: 'reservation', component: ReservationComponent },
{ path: 'insurances', component: InsurancesComponent },
{ path: 'add-insurance', component: InsurancesComponent, data: { showFormOnly: true } },
{ path: 'sinisters', component: SinistersComponent }, 
{ path: 'insurance-car-details/:id', component: InsuranceCarDetailsComponent },
{ path: 'insurance-house-details/:id', component: InsuranceHouseDetailsComponent },
{ path: 'insurance-health-details/:id', component: InsuranceHealthDetailsComponent },
{ path: 'insurance-journey-details/:id', component: InsuranceJourneyDetailsComponent },
{ path: 'emergency', component: EmergencyTowingComponent },
// Routes specific to InsuranceProject that we've implemented
{ path: 'sinister-list', component: SinistersComponent },
{ path: 'towings', component: TowingComponent },
{ path: 'agents', component: AgentListComponent },
{ path: 'agents-espace', component: AgentTowingComponent },
{ path: 'recommendations', component: RecommendationComponent },
{ path: 'payment-success', component: PaymentSuccessComponent,title: 'Paiement confirmé' },
{ path: 'assurance-devis', component: AssuranceDevisComponent },
{path: 'voyage',component:AssuranceVoyageFormComponent},
{ path: 'ecolia', component: EcoliaFormComponent },
{ path: 'habitation', component: AssuranceHabitationFormComponent },
{ path: 'accident', component: AssuranceAccidentsFormComponent },
{ path: 'sacre-capitalisation', component: SacreCapitalisationFormComponent },
{ path: 'sante', component: SanteFormComponent },
{ path: 'assurance-devis', component: AssuranceDevisComponent },
{ path: 'emergency-towing', component: EmergencyTowingComponent },
{ path: 'health', component: HealthInsuranceComponent },

  
  // Routes with sidebar using MainLayoutComponent
  { 
    path: 'admin', 
    component: AdminLayoutComponent,
    children: [
      { path: 'dashboardAdmin', component: DashboardAdminComponent },
      { path: 'users', component: UserListComponent },
      {path: 'profile', component: ProfileComponent},
      {path: 'update/:id', component: UpdateUserComponent},
      {path: 'register', component: RegisterComponent},
      { path: 'claim-admin', component: ClaimAdminComponent },
      { path: 'claim-list', component: ClaimListComponent },
      { path: 'contrats', component: ContratsComponent },
      { path: 'factures', component: FacturesComponent },
      { path: 'agency', component: AgencyComponent },
      { path: 'agency-list', component: AgencyListComponent },
      { path: 'agent-list', component: AgentListComponent },
      { path: 'insurances', component: InsurancesComponent },
      { path: 'rating-list', component: RatingListComponent },
      { path: 'jobManagement', component: JobOfferAdminComponent },
      { path: 'jobAppAdmin', component: JobAppAdminComponent },
      { path: 'DisponibiliteAdmin', component: AvailabilityAdminComponent},
      { path: 'appointmentManagement', component: AppointmentManagementComponent },
      { path: 'jobAdd', component: AddJobComponent },
      { path: 'sinisters', component: AdminSinistersListComponent },
      { path: 'add-insurance', component: InsuranceFormComponent },
      { path: 'insurance-management', component: InsuranceAdminComponent },
      { path: 'notifications', component: AllNotificationsComponent },
      { path: 'messages', component: AllMessagesComponent },
      { path: 'chat', component: ChatComponent },
      { path: 'agents', component: AgentListComponent },
      { path: 'agents-espace', component: AgentTowingComponent },
      { path: 'recommendations', component: RecommendationComponent },
      { path: 'towings', component: TowingComponent },






    ]
  },
  {
    path: 'user',
    component: UserLayoutComponent,
    canActivate: [RoleGuard],        
    children: [
      { path: 'dashboard', component: DashboardAdminComponent },
      { path: 'claim', component: ClaimComponent },
      { path: 'profile', component: ProfileComponent },
      { path: 'update/:id', component: UpdateUserComponent },
      { path: 'reservation', component: ReservationComponent },
      { path: 'sinisters', component: SinistersComponent }, 
      { path: 'emergency', component: EmergencyTowingComponent },
      { path: 'notifications', component: AllNotificationsComponent },
      { path: 'messages', component: AllMessagesComponent },
      { path: 'chat', component: ChatComponent },
      { path: 'payment', component: PaymentComponent },
     
   
    ]
  },
  {
    path: 'agent',
    component: AgentLayoutComponent, 
    canActivate: [RoleGuard],     
    children: [
      { path: 'dashboardAgent', component: DashboardAgentComponent },
      {path: 'profile', component: ProfileComponent},
      {path: 'update/:id', component: UpdateUserComponent},
      { path: 'towing', component: AgentTowingComponent },
      { path: 'notifications', component: AllNotificationsComponent },
      { path: 'messages', component: AllMessagesComponent },
      { path: 'chat', component: ChatComponent },
      { path: 'agents-espace', component: AgentTowingComponent },
      { path: 'DisponibiliteAdmin', component: AvailabilityAdminComponent},
      { path: 'Rendez-vous', component: AvailabilityComponent },


    ]
  },
  // Fallback route
  { path: '**', redirectTo: 'home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }