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
import { LoginComponent } from './user/login/login.component';
import { RegisterComponent } from './user/register/register.component';
import { ProfileComponent } from './user/profile/profile.component';
import { UpdateUserComponent } from './user/update-user/update-user.component';
import { UserListComponent } from './user/user-list/user-list.component';
import { SignupComponent } from './user/signup/signup.component';
import { AdminGuard } from './guards/admin.guard';
import { AdminLayoutComponent } from './layout/admin-layout/admin-layout.component';
import { RatingListComponent } from './components/rating-list/rating-list.component';

const routes: Routes = [
  // Public routes
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'blog', component: BlogComponent },
  { path: 'blog-details', component: BlogDetailsComponent },
  { path: 'contact-us', component: ContactUsComponent },
  { path: 'insurances', component: InsurancesComponent },
  { path: 'claim', component: ClaimComponent },
  { path: 'claim-list', component: ClaimListComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  
  // Admin routes with AdminLayout
  { 
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [AdminGuard],
    children: [
      { path: 'dashboard', component: DashboardAdminComponent },
      { path: 'claims', component: ClaimAdminComponent },
      { path: 'agency', component: AgencyComponent },
      { path: 'agencies', component: AgencyListComponent },
      { path: 'agents', component: AgentListComponent },
      { path: 'users', component: UserListComponent },
      { path: 'profile', component: ProfileComponent },
      { path: 'register', component: RegisterComponent },
      { path: 'update/:id', component: UpdateUserComponent },
      { path: 'ratings', component: RatingListComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
  
  // Redirect old admin URLs to new structure
  { path: 'dashboard-admin', redirectTo: 'admin/dashboard', pathMatch: 'full' },
  { path: 'claim-admin', redirectTo: 'admin/claims', pathMatch: 'full' },
  { path: 'agency-list', redirectTo: 'admin/agencies', pathMatch: 'full' },
  { path: 'agent-list', redirectTo: 'admin/agents', pathMatch: 'full' },
  { path: 'users', redirectTo: 'admin/users', pathMatch: 'full' },
  { path: 'profile', component: ProfileComponent }, // Keep this for non-admin users
  
  // Catch-all route
  { path: '**', redirectTo: 'home' } 
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }