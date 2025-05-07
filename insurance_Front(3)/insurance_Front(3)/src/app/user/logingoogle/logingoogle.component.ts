import { Component } from '@angular/core';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-logingoogle',
  templateUrl: './logingoogle.component.html',
  styleUrls: ['./logingoogle.component.css']
})
export class LogingoogleComponent {
  userData: any;
  constructor(private user: UsersService) {}

  ngOnInit() {
    this.user.currentUserData.subscribe((userData: any) => (this.userData = userData));
  }

  changeData(event: { target: { value: any; }; }) {
    var msg = event.target.value;
    this.user.changeData(msg);
  }
  login(data: any) {
    this.user.changeData(data);
  }
}
