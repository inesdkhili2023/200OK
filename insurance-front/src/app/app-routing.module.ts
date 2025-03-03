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

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'blog', component: BlogComponent },
  { path: 'blog-details', component: BlogDetailsComponent },
  { path: 'contact-us', component: ContactUsComponent },
  { path: 'admin/dashboard', component: DashboardAdminComponent },
  { path: 'insurances', component: InsurancesComponent },
  { path: 'claim', component: ClaimComponent},
  { path: 'claim-list', component: ClaimListComponent},
  { path: 'claim-admin', component: ClaimAdminComponent},
  { path: 'agency', component: AgencyComponent},
  { path: 'agency-list', component: AgencyListComponent},
  { path: 'agent-list', component: AgentListComponent},
  { path: '**', redirectTo: 'home' } 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }