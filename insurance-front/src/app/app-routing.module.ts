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
import { LoginAttentanceComponent } from './user/login-attentance/login-attentance.component';
import { FaceDetectionComponent } from './user/face-detection/face-detection.component';
import { FaceDetectionGuard } from './guards/face-detection.guard';
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { UserLayoutComponent } from './layouts/user-layout/user-layout.component';
import { AgentLayoutComponent } from './layouts/agent-layout/agent-layout.component';
import { DashboardAgentComponent } from './dashboard-agent/dashboard-agent.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
{ path: 'blog', component: BlogComponent, canActivate: [AuthGuard] },
{ path: 'blog-details', component: BlogDetailsComponent, canActivate: [AuthGuard] },
{ path: 'contact-us', component: ContactUsComponent, canActivate: [AuthGuard] },
{ path: 'insurances', component: InsurancesComponent, canActivate: [AuthGuard] },
{ path: 'login', component: LoginComponent, canActivate: [AuthGuard] },
{ path: 'signup', component: SignupComponent, canActivate: [FaceDetectionGuard, AuthGuard] },
{ path: 'sendemail', component: SendemailComponent, canActivate: [AuthGuard] },
{ path: 'google', component: LogingoogleComponent, canActivate: [AuthGuard] },
{ path: 'resetpassword', component: ResetpasswordComponent, canActivate: [AuthGuard] },
{ path: 'detect-face', component: FaceDetectionComponent, canActivate: [AuthGuard] },
{ path: 'loginface', component: LoginAttentanceComponent, canActivate: [AuthGuard] },

  {
    path: 'admin',
    component: AdminLayoutComponent, 
    canActivate: [RoleGuard],     
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
    canActivate: [RoleGuard],        
    children: [
      { path: 'dashboard', component: DashboardAdminComponent },
      { path: 'profile', component: ProfileComponent },
      { path: 'update/:id', component: UpdateUserComponent },
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
     
      
    ]
  },
  { path: '**', redirectTo: 'home' } 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }