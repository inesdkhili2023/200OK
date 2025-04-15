import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { BlogComponent } from './pages/blog/blog.component';
import { BlogDetailsComponent } from './pages/blog-details/blog-details.component';
import { ContactUsComponent } from './pages/contact-us/contact-us.component';
import { DashboardAdminComponent } from './dashboard-admin/dashboard-admin.component';
import { PaymentComponent } from './pages/payment/payment.component';
import { AssuranceDevisComponent } from './pages/assurance-devis/assurance-devis.component';
import { EcoliaFormComponent } from './forms/ecolia-form/ecolia-form.component';
import { AssuranceHabitationFormComponent } from './forms/assurance-habitation-form/assurance-habitation-form.component';
import { AssuranceAccidentsFormComponent } from './forms/assurance-accidents-form/assurance-accidents-form.component';
import { SacreCapitalisationFormComponent } from './forms/sacre-capitalisation-form/sacre-capitalisation-form.component';
import { SanteFormComponent } from './forms/sante-form/sante-form.component';
import { MenuLateralComponent } from './menu-lateral/menu-lateral.component';
import { ContratsComponent } from './contrats/contrats.component';
import { FacturesComponent } from './factures/factures.component';
import { AssuranceVoyageFormComponent } from './forms/assurance-voyage-form/assurance-voyage-form.component';
import{PaymentSuccessComponent} from './payment-success/payment-success.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },

  // Routes sans menu latéral
  { path: 'home', component: HomeComponent },
  { path: 'blog', component: BlogComponent },
  { path: 'blog-details', component: BlogDetailsComponent },
  { path: 'contact-us', component: ContactUsComponent },
  { path: 'ecolia', component: EcoliaFormComponent },
  { path: 'habitation', component: AssuranceHabitationFormComponent },
  { path: 'accident', component: AssuranceAccidentsFormComponent },
  { path: 'sacre-capitalisation', component: SacreCapitalisationFormComponent },
  { path: 'sante', component: SanteFormComponent },
  { path: 'menu', component: MenuLateralComponent },
  { path: 'assurance-devis', component: AssuranceDevisComponent },
  { path: 'admin/dashboard', component: DashboardAdminComponent },
  { path: 'payment', component: PaymentComponent },
  { path: 'payment-success', component: PaymentSuccessComponent,title: 'Paiement confirmé' },
  {path: 'voyage',component:AssuranceVoyageFormComponent},
  { path: 'home', component: HomeComponent },
  { path: 'contrats', component: ContratsComponent },
  { path: 'factures', component: FacturesComponent },
     

    
  

  // Catch-all pour rediriger vers home si la route n'existe pas
  { path: '**', redirectTo: 'home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
