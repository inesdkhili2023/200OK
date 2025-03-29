import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { BlogComponent } from './pages/blog/blog.component';
import { BlogDetailsComponent } from './pages/blog-details/blog-details.component';
import { ContactUsComponent } from './pages/contact-us/contact-us.component';
import { DashboardAdminComponent } from './dashboard-admin/dashboard-admin.component';
import { AdminSinistersListComponent } from './pages/admin-sinisters-list/admin-sinisters-list.component';
import { InsurancesComponent } from './pages/insurances/insurances.component';
import { SinistersComponent } from './pages/sinisters/sinisters.component';
import { RecommendationComponent } from './pages/recommendation/recommendation.component';
import { AgentTowingComponent } from './pages/agent-towing/agent-towing.component';
import { TowingComponent } from './pages/towing/towing.component';
import { AgentEspaceComponent } from './pages/agent-espace/agent-espace.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'blog', component: BlogComponent },
  { path: 'blog-details', component: BlogDetailsComponent },
  { path: 'contact-us', component: ContactUsComponent },
  { path: 'admin/dashboard', component: DashboardAdminComponent },
  { path: 'admin/sinisters', component: AdminSinistersListComponent },
  { path: 'insurances', component: InsurancesComponent },
  { path: 'recommendations', component: RecommendationComponent },
  { path: 'agents', component: AgentTowingComponent },
  { path: 'agents-espace', component: AgentEspaceComponent },
  { path: 'towings', component: TowingComponent },
  { path: 'sinisters', component: SinistersComponent }, 
  { path: '**', redirectTo: 'home' } ,
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }