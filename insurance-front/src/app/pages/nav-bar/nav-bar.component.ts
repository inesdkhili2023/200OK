import { Component } from '@angular/core';
<<<<<<< HEAD
=======
import { UsersService } from 'src/app/services/users.service';
>>>>>>> c9305956a030b291610f62d4a496788fd831d8e1

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent {
<<<<<<< HEAD

=======
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
>>>>>>> c9305956a030b291610f62d4a496788fd831d8e1
}
