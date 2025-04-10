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

import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { PaymentComponent } from './pages/payment/payment.component';
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';


import { AssuranceDevisComponent } from './pages/assurance-devis/assurance-devis.component';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule } from '@angular/material/dialog';

import { AssuranceHabitationFormComponent } from './forms/assurance-habitation-form/assurance-habitation-form.component';
import { SanteFormComponent } from './forms/sante-form/sante-form.component';
import { EpargneFormComponent } from './forms/epargne-form/epargne-form.component';
import { RetraiteFormComponent } from './forms/retraite-form/retraite-form.component';
import { AssuranceAccidentsFormComponent } from './forms/assurance-accidents-form/assurance-accidents-form.component';
import { SacreCapitalisationFormComponent } from './forms/sacre-capitalisation-form/sacre-capitalisation-form.component';
import { SacrePrevoyanceFormComponent } from './forms/sacre-prevoyance-form/sacre-prevoyance-form.component';
import { AssuranceSanteInternationaleFormComponent } from './forms/assurance-sante-internationale-form/assurance-sante-internationale-form.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PackModalComponentComponent } from './forms/pack-modal-component/pack-modal-component.component';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ContratsComponent } from './contrats/contrats.component';
import { FacturesComponent } from './factures/factures.component';
import { FactureService } from './services/facture.service'; // Importez votre service
import { AssuranceVoyageFormComponent } from './forms/assurance-voyage-form/assurance-voyage-form.component';
import { RecaptchaModule } from 'ng-recaptcha';
import { PaymentSuccessComponent } from './payment-success/payment-success.component';






@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    BlogComponent,
    BlogDetailsComponent,
    ContactUsComponent,
    NavBarComponent,
    FooterComponent,
    DashboardAdminComponent,
     AssuranceHabitationFormComponent,
     AssuranceVoyageFormComponent ,
    SanteFormComponent,
    EpargneFormComponent,
    RetraiteFormComponent,
    AssuranceAccidentsFormComponent,
    SacreCapitalisationFormComponent,
    SacrePrevoyanceFormComponent,
    AssuranceSanteInternationaleFormComponent,
    PackModalComponentComponent,
    ContratsComponent,
    FacturesComponent
   
],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule , 
    MatCardModule ,
    MatMenuModule ,
    BrowserAnimationsModule,
    ReactiveFormsModule ,
    MatDialogModule ,
    BrowserModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    RouterModule ,
    RecaptchaModule
    
  ],
  providers: [    FactureService],
  bootstrap: [AppComponent]
})
export class AppModule { }
