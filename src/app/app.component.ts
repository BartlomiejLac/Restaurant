import { Component } from '@angular/core';
import dishes from '../assets/dishes.json';
import { LogService } from './log.service';
import { Dish } from './structures/Dish'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Restaurant';

  constructor(public loginService: LogService) {}
  isLoggedIn(){
    return localStorage['user']!==undefined;
  }

  logOut(){
    if (confirm("Are you sure you want to log out?")){
      this.loginService.logout();
    }
  }

  getMail(){
    if (localStorage['mail']===undefined) return "!";
    return " " + localStorage['mail'] + "!";
  }

  isAdmin() {
    if (!this.isLoggedIn()) return false;
    return localStorage['role'] === String(true);
  }
}


