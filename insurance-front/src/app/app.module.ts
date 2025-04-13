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
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { UpdateUserComponent } from './user/update-user/update-user.component';
import { UserListComponent } from './user/user-list/user-list.component';
import { RegisterComponent } from './user/register/register.component';
import { ProfileComponent } from './user/profile/profile.component';
import { LoginComponent } from './user/login/login.component'; // <-- add this import
import { SignupComponent } from './user/signup/signup.component';
import { SendemailComponent } from './user/sendemail/sendemail.component';
import { ResetpasswordComponent } from './user/resetpassword/resetpassword.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LogingoogleComponent } from './user/logingoogle/logingoogle.component';
import { ConfirmationComponentComponent } from './user/confirmation-component/confirmation-component.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { FaceLoginComponent } from './user/face-login/face-login.component';
import { LoginAttentanceComponent } from './user/login-attentance/login-attentance.component';
import { FaceDetectionComponent } from './user/face-detection/face-detection.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ConfirmDialogComponent } from './user/confirm-dialog/confirm-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { ConfirmSnackbarComponent } from './notif/confirm-snackbar/confirm-snackbar.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { UserLayoutComponent } from './layouts/user-layout/user-layout.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    BlogComponent,
    BlogDetailsComponent,
    ContactUsComponent,
    NavBarComponent,
    FooterComponent,
    SignupComponent,
    DashboardAdminComponent,
    InsurancesComponent,
    UpdateUserComponent,
    UserListComponent,
    RegisterComponent,
    ProfileComponent,
    LoginComponent,
    SendemailComponent,
    ResetpasswordComponent,
    DashboardComponent,
    LogingoogleComponent,
    ConfirmationComponentComponent,
    FaceLoginComponent,
    LoginAttentanceComponent,
    FaceDetectionComponent,
    ConfirmDialogComponent,
    ConfirmSnackbarComponent,
    AdminLayoutComponent,
    UserLayoutComponent,
  ],
  imports: [
    BrowserModule,
    MatSnackBarModule,
    BrowserAnimationsModule, 
    MatDialogModule,
    MatButtonModule,
    ToastrModule.forRoot(),
    AppRoutingModule,
    FormsModule,
    HttpClientModule    // <-- add this module
  ],
  
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
