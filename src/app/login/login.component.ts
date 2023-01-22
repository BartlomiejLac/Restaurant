import { Component, OnInit} from '@angular/core';
import { LogService } from '../log.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{

  constructor(public loginService: LogService, public router: Router) {}

  ngOnInit() {
    if (this.isLoggedIn()) this.router.navigate(['main']);
  }
  onSignup(email: string, password: string){
    this.loginService.signup(email, password).then((resp) => {
      if (resp) this.router.navigate(['main']);
    });
  }

  onLogin(email: string, password: string){
    this.loginService.signin(email, password).then((resp) => {
      if (resp) this.router.navigate(['main']);
    });
  }

  isLoggedIn(){
    return localStorage['user']!==undefined;
  }
}
