import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {  ToastrService } from 'ngx-toastr';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit  {
  constructor(private readonly userService:UsersService,
    private readonly router: Router,
  private readonly toastr:ToastrService){}

    isAdmin:boolean = false;
    isUser:boolean = false;
    profileInfo: any;
    errorMessage: string = ''

    

  async ngOnInit() {
    this.isAdmin = this.userService.isAdmin();
    this.isUser = this.userService.isUser();
    try {
      const token = localStorage.getItem('token')
      if(!token){
        throw new Error("No Token Found")
      }

      this.profileInfo = await this.userService.getYourProfile(token);
    } catch (error:any) {
      this.showError(error.message)
    }
      
  }


  updateProfile(id: string) {
    if (this.isAdmin) {
      this.router.navigate(['/admin/update', id]);
    } else if (this.isUser) {
      this.router.navigate(['/user/update', id]);
    } else {
      this.toastr.error("Type d'utilisateur non reconnu");
    }
  }
  

  showError(mess: string) {
    this.errorMessage = mess;
    setTimeout(() => {
      this.errorMessage = ''
    }, 3000)
  }
  
}