import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContactUsComponent } from './pages/contact-us/contact-us.component';
import { BlogComponent } from './pages/blog/blog.component';
import{ServicesComponent}from './components/services/services.component';
import{ BlogDetailsComponent}from'./pages/blog-details/blog-details.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  { 
    path: '', component: HomeComponent},
  {  path: 'services', component: ServicesComponent },
  { path: 'contact', component: ContactUsComponent },
  { path: 'blog', component: BlogComponent },
  { path: 'blog/:id', component: BlogDetailsComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' } 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
