import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { BlogComponent } from './pages/blog/blog.component';
import { BlogDetailsComponent } from './pages/blog-details/blog-details.component';
import { ContactUsComponent } from './pages/contact-us/contact-us.component';
import { DashboardAdminComponent } from './dashboard-admin/dashboard-admin.component';
import { InsurancesComponent } from './pages/insurances/insurances.component';
<<<<<<< HEAD
import { ClaimComponent } from './pages/claim/claim.component';
import { ClaimListComponent } from './pages/claim-list/claim-list.component';
import { ClaimAdminComponent } from './pages/claim-admin/claim-admin.component';
import { AgencyComponent } from './pages/agency/agency.component';
import { AgencyListComponent } from './pages/agency-list/agency-list.component';
import { MapComponent } from './pages/map/map.component';
import { AgentListComponent } from './pages/agent-list/agent-list.component';
=======
import { LoginComponent } from './user/login/login.component';
import { RegisterComponent } from './user/register/register.component';
import { ProfileComponent } from './user/profile/profile.component';
import { UpdateUserComponent } from './user/update-user/update-user.component';
import { UserListComponent } from './user/user-list/user-list.component';
import { SignupComponent } from './user/signup/signup.component';
>>>>>>> c9305956a030b291610f62d4a496788fd831d8e1

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'blog', component: BlogComponent },
  { path: 'blog-details', component: BlogDetailsComponent },
  { path: 'contact-us', component: ContactUsComponent },
  { path: 'admin/dashboard', component: DashboardAdminComponent },
  { path: 'insurances', component: InsurancesComponent },
<<<<<<< HEAD
  { path: 'claim', component: ClaimComponent},
  { path: 'claim-list', component: ClaimListComponent},
  { path: 'claim-admin', component: ClaimAdminComponent},
  { path: 'agency', component: AgencyComponent},
  { path: 'agency-list', component: AgencyListComponent},
  { path: 'agent-list', component: AgentListComponent},
=======
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent,},
  {path: 'profile', component: ProfileComponent},
  {path: 'update/:id', component: UpdateUserComponent},
  {path: 'users', component: UserListComponent},
  {path: 'signup', component: SignupComponent},
>>>>>>> c9305956a030b291610f62d4a496788fd831d8e1
  { path: '**', redirectTo: 'home' } 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }