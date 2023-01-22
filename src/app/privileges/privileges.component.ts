import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DishService } from '../dish.service';
import { Role } from '../structures/Role';

@Component({
  selector: 'app-privileges',
  templateUrl: './privileges.component.html',
  styleUrls: ['./privileges.component.css']
})
export class PrivilegesComponent {

  userList : Role[] = [];

  constructor(private dishService: DishService, private router: Router){
    if (!this.isAdmin()) {
      alert("You need to be an admin");
      this.router.navigate(['main']);
    }

    this.dishService.getAllRoles().then((response) => {
      this.userList = response;
    })
  }

  getMail(){
    if (localStorage['mail']===undefined) return "!";
    return localStorage['mail'];
  }


  isLoggedIn(){
    return localStorage['user']!==undefined;
  }

  isAdmin() {
    if (!this.isLoggedIn()) return false;
    return localStorage['role'] === String(true);
  }

  switchPermission(id: string, admin: boolean){
    this.dishService.updateRole(id, !admin);
    this.dishService.getAllRoles().then((response) => {
      this.userList = response;
    })
  }

}
