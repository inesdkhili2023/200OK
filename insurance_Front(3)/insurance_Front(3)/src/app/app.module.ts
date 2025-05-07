import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Angular Forms & HTTP
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

// Angular Material Modules
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSortModule } from '@angular/material/sort';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatStepperModule } from '@angular/material/stepper';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';

// Other Modules
import { ToastrModule } from 'ngx-toastr';
import { FullCalendarModule } from '@fullcalendar/angular';
import { RecaptchaModule, RecaptchaFormsModule } from 'ng-recaptcha';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { NgxPaginationModule } from 'ngx-pagination';

// Pages & Layouts
import { HomeComponent } from './pages/home/home.component';
import { BlogComponent } from './pages/blog/blog.component';
import { BlogDetailsComponent } from './pages/blog-details/blog-details.component';
import { ContactUsComponent } from './pages/contact-us/contact-us.component';
import { NavBarComponent } from './pages/nav-bar/nav-bar.component';
import { FooterComponent } from './pages/footer/footer.component';
import { DashboardAdminComponent } from './dashboard-admin/dashboard-admin.component';
import { InsurancesComponent } from './pages/insurances/insurances.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DashboardAgentComponent } from './dashboard-agent/dashboard-agent.component';

// Claim & Agency
import { ClaimComponent } from './pages/claim/claim.component';
import { AgencyComponent, ValidationPopupComponent } from './pages/agency/agency.component';
import { ClaimAdminComponent } from './pages/claim-admin/claim-admin.component';
import { MapComponent } from './pages/map/map.component';
import { AgencyListComponent } from './pages/agency-list/agency-list.component';
import { ClaimListComponent } from './pages/claim-list/claim-list.component';
import { SideBarComponent } from './pages/side-bar/side-bar.component';
import { AgentListComponent } from './pages/agent-list/agent-list.component';

// Auth & User
import { LoginComponent } from './user/login/login.component';
import { SignupComponent } from './user/signup/signup.component';
import { SendemailComponent } from './user/sendemail/sendemail.component';
import { ResetpasswordComponent } from './user/resetpassword/resetpassword.component';
import { UpdateUserComponent } from './user/update-user/update-user.component';
import { UserListComponent } from './user/user-list/user-list.component';
import { RegisterComponent } from './user/register/register.component';
import { ProfileComponent } from './user/profile/profile.component';
import { LogingoogleComponent } from './user/logingoogle/logingoogle.component';
import { ConfirmationComponentComponent } from './user/confirmation-component/confirmation-component.component';
import { LoginAttentanceComponent } from './user/login-attentance/login-attentance.component';
import { FaceDetectionComponent } from './user/face-detection/face-detection.component';
import { ConfirmDialogComponent } from './user/confirm-dialog/confirm-dialog.component';

// Notif & Rating
import { ConfirmSnackbarComponent } from './notif/confirm-snackbar/confirm-snackbar.component';
import { RatingDialogComponent } from './components/rating-dialog/rating-dialog.component';
import { RatingListComponent } from './components/rating-list/rating-list.component';

// Layouts
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { UserLayoutComponent } from './layouts/user-layout/user-layout.component';
import { AgentLayoutComponent } from './layouts/agent-layout/agent-layout.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';

// RH & Job Modules
import { JobOfferManagementComponent } from './job-offer-management/job-offer-management.component';
import { PolitiqueRHComponent } from './politique-rh/politique-rh.component';
import { JobOfferComponent } from './job-offer/job-offer.component';
import { JobApplicationFormComponent } from './job-application-form/job-application-form.component';
import { CandidatureSComponent } from './candidature-s/candidature-s.component';
import { JobOfferDetailsComponent } from './job-offer-details/job-offer-details.component';
import { AddJobComponent } from './add-job/add-job.component';
import { JobOfferAdminComponent } from './job-offer-admin/job-offer-admin.component';
import { JobOfferEditComponent } from './job-offer-edit/job-offer-edit.component';
import { JobAppAdminComponent } from './job-app-admin/job-app-admin.component';

// Rendez-vous & Availability
import { ReservationComponent } from './reservation/reservation.component';
import { AppointmentManagementComponent } from './appointment-management/appointment-management.component';
import { AvailabilityComponent } from './availability/availability.component';
import { AvailabilityAdminComponent } from './availability-admin/availability-admin.component';
import { AvailabilityEditComponent } from './availability-edit/availability-edit.component';

// Divers
import { WeatherComponent } from './weather/weather.component';

// Services
import { UsersService } from './services/users.service';
import { RatingService } from './services/rating.service';
import { AvailabilityService } from './services/availability.service';
import { FactureService } from './services/facture.service';

//insurance:
import { SinistersComponent } from './pages/sinisters/sinisters.component';
import { InsuranceFormComponent } from './pages/insurance-form/insurance-form.component';
import { AdminSinistersListComponent } from './pages/admin-sinisters-list/admin-sinisters-list.component';
import { MapLocationComponent } from './pages/map-location/map-location.component';
import { InsuranceAdminComponent } from './insurance-admin/insurance-admin.component';

//towing 
import { TowingComponent } from './pages/towing/towing.component';

// Standalone components
import { ChatComponent } from './pages/chat/chat.component';
import { NotificationBellComponent } from './pages/notification/notification-bell.component';
import { AllNotificationsComponent } from './pages/all-notifications/all-notifications.component';
import { AllMessagesComponent } from './pages/all-messages/all-messages.component';

// Services we've created
import { AgentTowingService } from './services/agent-towing.service';
import { RecommendationComponent } from './pages/recommendation/recommendation.component';
import { AgentTowingComponent } from './pages/agent-towing/agent-towing.component';
import { AdminExportComponent } from './pages/admin-export/admin-export.component';
import { QRCodeComponent } from './pages/qr-code/qr-code.component';
import { EmergencyTowingComponent } from './pages/emergency-towing/emergency-towing.component';
import { TowingRequestComponent } from './pages/towing-request/towing-request.component';
import { AdminMessagesComponent } from './dashboard-admin/admin-messages/admin-messages.component';
import { DashboardHomeComponent } from './dashboard-admin/dashboard-home/dashboard-home.component';

// Payment & Assurance
import { PaymentComponent } from './pages/payment/payment.component';
import { AssuranceDevisComponent } from './pages/assurance-devis/assurance-devis.component';
import { AssuranceHabitationFormComponent } from './forms/assurance-habitation-form/assurance-habitation-form.component';
import { SanteFormComponent } from './forms/sante-form/sante-form.component';
import { EpargneFormComponent } from './forms/epargne-form/epargne-form.component';
import { RetraiteFormComponent } from './forms/retraite-form/retraite-form.component';
import { AssuranceAccidentsFormComponent } from './forms/assurance-accidents-form/assurance-accidents-form.component';
import { SacreCapitalisationFormComponent } from './forms/sacre-capitalisation-form/sacre-capitalisation-form.component';
import { SacrePrevoyanceFormComponent } from './forms/sacre-prevoyance-form/sacre-prevoyance-form.component';
import { PackModalComponentComponent } from './forms/pack-modal-component/pack-modal-component.component';
import { ContratsComponent } from './contrats/contrats.component';
import { FacturesComponent } from './factures/factures.component';
import { AssuranceVoyageFormComponent } from './forms/assurance-voyage-form/assurance-voyage-form.component';
import { PaymentSuccessComponent } from './payment-success/payment-success.component';
import { HealthInsuranceComponent } from './health-insurance/health-insurance.component';

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
    InsurancesComponent,
    DashboardComponent,
    DashboardAgentComponent,
    ClaimComponent,
    AgencyComponent,
    ValidationPopupComponent,
    ClaimAdminComponent,
    MapComponent,
    AgencyListComponent,
    ClaimListComponent,
    SideBarComponent,
    AgentListComponent,
    LoginComponent,
    SignupComponent,
    SendemailComponent,
    ResetpasswordComponent,
    UpdateUserComponent,
    UserListComponent,
    RegisterComponent,
    ProfileComponent,
    LogingoogleComponent,
    ConfirmationComponentComponent,
    LoginAttentanceComponent,
    FaceDetectionComponent,
    ConfirmDialogComponent,
    ConfirmSnackbarComponent,
    RatingDialogComponent,
    RatingListComponent,
    AdminLayoutComponent,
    UserLayoutComponent,
    AgentLayoutComponent,
    MainLayoutComponent,
    JobOfferManagementComponent,
    PolitiqueRHComponent,
    JobOfferComponent,
    CandidatureSComponent,
    JobApplicationFormComponent,
    ReservationComponent,
    JobOfferDetailsComponent,
    AddJobComponent,
    JobOfferAdminComponent,
    AppointmentManagementComponent,
    JobOfferEditComponent,
    JobAppAdminComponent,
    AvailabilityComponent,
    AvailabilityAdminComponent,
    AvailabilityEditComponent,
    WeatherComponent,
    SinistersComponent,
    InsuranceFormComponent,
    AdminSinistersListComponent,
    InsuranceAdminComponent,
    MapLocationComponent,
    TowingComponent,
    AdminSinistersListComponent,
    RecommendationComponent,
    AgentTowingComponent,
    AdminExportComponent,
    QRCodeComponent,
    EmergencyTowingComponent,
    TowingRequestComponent,
    AdminMessagesComponent,
    DashboardHomeComponent,
    AllNotificationsComponent,
    AssuranceHabitationFormComponent,
    SanteFormComponent,
    EpargneFormComponent,
    RetraiteFormComponent,
    AssuranceAccidentsFormComponent,
    SacreCapitalisationFormComponent,
    SacrePrevoyanceFormComponent,
    PackModalComponentComponent,
    ContratsComponent,
    FacturesComponent,
    AssuranceVoyageFormComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    CommonModule,
    BrowserAnimationsModule,
    MatSnackBarModule,
    MatDialogModule,
    MatButtonModule,
    MatPaginatorModule,
    MatTableModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonToggleModule,
    MatCardModule,
    MatToolbarModule,
    MatIconModule,
    MatMenuModule,
    MatSortModule,
    MatProgressBarModule,
    MatStepperModule,
    MatSidenavModule,
    MatListModule,
    ToastrModule.forRoot({
      positionClass: 'toast-bottom-right',
      timeOut: 3000,
      closeButton: true
    }),
    FullCalendarModule,
    RecaptchaModule,
    RecaptchaFormsModule,
    NgxMaterialTimepickerModule,
    ChatComponent,
    NotificationBellComponent,
    NgxPaginationModule,
    AllMessagesComponent,
    HealthInsuranceComponent

  ],
  providers: [
    UsersService,
    RatingService,
    AvailabilityService,
    FactureService,
    AgentTowingService,
    { provide: MAT_DIALOG_DATA, useValue: {} },
    { provide: MatDialogRef, useValue: {} }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }