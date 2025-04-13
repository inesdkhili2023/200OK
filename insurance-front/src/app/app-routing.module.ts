import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { BlogComponent } from './pages/blog/blog.component';
import { BlogDetailsComponent } from './pages/blog-details/blog-details.component';
import { ContactUsComponent } from './pages/contact-us/contact-us.component';
import { DashboardAdminComponent } from './dashboard-admin/dashboard-admin.component';
import { InsurancesComponent } from './pages/insurances/insurances.component';
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
import { FaceLoginComponent } from './user/face-login/face-login.component';
import { LoginAttentanceComponent } from './user/login-attentance/login-attentance.component';
import { FaceDetectionComponent } from './user/face-detection/face-detection.component';
import { FaceDetectionGuard } from './guards/face-detection.guard';
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { UserLayoutComponent } from './layouts/user-layout/user-layout.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'detect-face', component: FaceDetectionComponent },
  { path: 'blog', component: BlogComponent },
  { path: 'loginface', component: LoginAttentanceComponent },
  { path: 'blog-details', component: BlogDetailsComponent },
  { path: 'contact-us', component: ContactUsComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'insurances', component: InsurancesComponent },
  {path: 'login', component: LoginComponent},
  {path: 'profile', component: ProfileComponent},
  {path: 'update/:id', component: UpdateUserComponent},
  {path: 'signup', component: SignupComponent, canActivate: [FaceDetectionGuard]},
  {path: 'sendemail', component: SendemailComponent},
  {path: 'google', component: LogingoogleComponent},
  {path: 'facial', component: FaceLoginComponent},
  {path: 'resetpassword', component: ResetpasswordComponent},
  
  {
    path: 'admin',
    component: AdminLayoutComponent, 
    children: [
      { path: 'dashboardAdmin', component: DashboardAdminComponent },
      { path: 'users', component: UserListComponent },
      {path: 'profile', component: ProfileComponent},
      {path: 'update/:id', component: UpdateUserComponent},
      {path: 'register', component: RegisterComponent},
     
      
    ]
  },
  {
    path: 'user',
    component: UserLayoutComponent, 
    children: [
      { path: 'dashboard', component: DashboardAdminComponent },
      {path: 'profile', component: ProfileComponent},
      {path: 'update/:id', component: UpdateUserComponent},
     
      
    ]
  },
  { path: '**', redirectTo: 'home' } 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }