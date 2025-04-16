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

const routes: Routes = [
  // Public routes without sidebar
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
      
      { path: 'agency', component: AgencyComponent },
      { path: 'agency-list', component: AgencyListComponent },
      { path: 'agent-list', component: AgentListComponent },
      { path: 'insurances', component: InsurancesComponent },
      { path: 'rating-list', component: RatingListComponent },
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
  // Fallback route
  { path: '**', redirectTo: 'home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }