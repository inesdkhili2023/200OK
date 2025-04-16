import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

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

// Services
import { UsersService } from './services/users.service';
import { RatingService } from './services/rating.service';

// Modules
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';

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
    MainLayoutComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    MatSnackBarModule,
    BrowserAnimationsModule,
    MatDialogModule,
    MatButtonModule,
    ToastrModule.forRoot(),
    MatPaginatorModule,
    MatTableModule,
    MatFormFieldModule,
    MatSelectModule,
    CommonModule
  ],
  providers: [UsersService, RatingService],
  bootstrap: [AppComponent]
})
export class AppModule { }
