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
import { ReactiveFormsModule } from '@angular/forms';
import { SinistersComponent } from './pages/sinisters/sinisters.component';
import { AdminSinistersListComponent } from './pages/admin-sinisters-list/admin-sinisters-list.component';
import { RecommendationComponent } from './pages/recommendation/recommendation.component';
import { AgentTowingComponent } from './pages/agent-towing/agent-towing.component';
import { TowingComponent } from './pages/towing/towing.component';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { AgentTowingService } from './services/agent-towing.service';
import { AgentEspaceComponent } from './pages/agent-espace/agent-espace.component';
import { ChatComponent } from './pages/chat/chat.component';
import { AdminExportComponent } from './pages/admin-export/admin-export.component';
import { QRCodeComponent } from './pages/qr-code/qr-code.component';
import { EmergencyTowingComponent } from './pages/emergency-towing/emergency-towing.component';
import { TowingRequestComponent } from './pages/towing-request/towing-request.component';

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
    SinistersComponent,
    RecommendationComponent,
    AgentTowingComponent,
    TowingComponent,
    AdminSinistersListComponent,
    AgentEspaceComponent,
    AdminExportComponent,
    QRCodeComponent,
    EmergencyTowingComponent,    TowingRequestComponent

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ChatComponent,
    CommonModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgxPaginationModule
  ],
  providers: [AgentTowingService],
  bootstrap: [AppComponent]
})
export class AppModule { }
