import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { FormsModule } from '@angular/forms';  


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ContactUsComponent } from './pages/contact-us/contact-us.component';
import { BlogComponent } from './pages/blog/blog.component';
import { BlogDetailsComponent } from './pages/blog-details/blog-details.component';
import { HeaderComponent } from './components/header/header.component';
import { SliderComponent } from './components/slider/slider.component';
import { IntroComponent } from './components/intro/intro.component';
import { QuoteFormComponent } from './components/quote-form/quote-form.component';
import { ProductsComponent } from './components/products/products.component';
import { ServicesComponent } from './components/services/services.component';
import { TestimonialsComponent } from './components/testimonials/testimonials.component';
import { RecentNewsComponent } from './components/recent-news/recent-news.component';
import { PartnersComponent } from './components/partners/partners.component';
import { FooterComponent } from './components/footer/footer.component';
import { CommentsComponent } from './components/comments/comments.component';
import { LeaveCommentComponent } from './components/leave-comment/leave-comment.component';
import { SearchComponent } from './components/search/search.component';
import { CategoriesComponent } from './components/categories/categories.component';
import { AgentDetailComponent } from './components/agent-detail/agent-detail.component';
import { HomeComponent } from './home/home.component';
import { RecommendationComponent } from './components/recommendation/recommendation.component';

@NgModule({
  declarations: [
    AppComponent,
    ContactUsComponent,
    BlogComponent,
    BlogDetailsComponent,
    HeaderComponent,
    SliderComponent,
    IntroComponent,
    QuoteFormComponent,
    ProductsComponent,
    ServicesComponent,
    TestimonialsComponent,
    RecentNewsComponent,
    PartnersComponent,
    FooterComponent,
    CommentsComponent,
    LeaveCommentComponent,
    SearchComponent,
    CategoriesComponent,
    AgentDetailComponent,
    HomeComponent,
    RecommendationComponent
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule, 
     FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
