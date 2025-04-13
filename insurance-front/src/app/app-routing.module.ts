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

const routes: Routes = [
  // Public routes without sidebar
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'blog', component: BlogComponent },
  { path: 'blog-details', component: BlogDetailsComponent },
  { path: 'contact-us', component: ContactUsComponent },
  { path: 'claim', component: ClaimComponent },
  
  // Routes with sidebar using MainLayoutComponent
  { 
    path: 'admin', 
    component: MainLayoutComponent,
    children: [
      { path: 'dashboard', component: DashboardAdminComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
  { 
    path: '', 
    component: MainLayoutComponent,
    children: [
      { path: 'claim-admin', component: ClaimAdminComponent },
      { path: 'claim-list', component: ClaimListComponent },
      
      { path: 'agency', component: AgencyComponent },
      { path: 'agency-list', component: AgencyListComponent },
      { path: 'agent-list', component: AgentListComponent },
      { path: 'insurances', component: InsurancesComponent },
      { path: 'rating-list', component: RatingListComponent },
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