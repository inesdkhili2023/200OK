import { Component } from '@angular/core';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent {
  constructor(private readonly userService: UsersService){}

  isAuthenticated:boolean = false;
  isAdmin:boolean = false;
  isUser:boolean = false;
  isAgent:boolean = false;


  ngOnInit(): void {
      this.isAuthenticated = this.userService.isAuthenticated();
      this.isAdmin = this.userService.isAdmin();
      this.isUser = this.userService.isUser();
      this.isAgent = this.userService.isAgent();
  }

  logout():void{
    this.userService.logOut();
    this.isAuthenticated = false;
    this.isAdmin = false;
    this.isUser = false;
    this.isAgent= false;

  }
}
