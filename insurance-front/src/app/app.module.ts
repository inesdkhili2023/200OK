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
import { InsurancesComponent } from './pages/insurances/insurances.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ClaimComponent } from './pages/claim/claim.component';
import { AgencyComponent } from './pages/agency/agency.component';
import { ClaimAdminComponent } from './pages/claim-admin/claim-admin.component';
import { MapComponent } from './pages/map/map.component';
import { AgencyListComponent } from './pages/agency-list/agency-list.component';
import { ClaimListComponent } from './pages/claim-list/claim-list.component';
import { SideBarComponent } from './pages/side-bar/side-bar.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatDialogModule } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ValidationPopupComponent } from './pages/agency/agency.component';
import { AgentListComponent } from './pages/agent-list/agent-list.component'; 
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { AssignAgencyDialog } from './pages/agent-list/agent-list.component';  

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
    InsurancesComponent,
    ClaimComponent,
    AgencyComponent,
    ClaimAdminComponent,
    MapComponent,
    AgencyListComponent,
    ClaimListComponent,
    SideBarComponent,
    ValidationPopupComponent,
    AgentListComponent,
    AssignAgencyDialog
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    MatPaginatorModule,
    MatTableModule,
    MatDialogModule,
    MatFormFieldModule,  
    MatSelectModule,     
    MatButtonModule,  
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule { }
