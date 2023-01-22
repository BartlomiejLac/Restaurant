import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DishService } from '../dish.service';
import { Dish } from '../structures/Dish';

@Component({
  selector: 'app-dish-creation-component',
  templateUrl: './dish-creation-component.component.html',
  styleUrls: ['./dish-creation-component.component.css']
})
export class DishCreationComponentComponent {
    public dishForm: FormGroup;

    constructor(
      public dishService : DishService,
      public formBuilder : FormBuilder,
      public router : Router
    ) {
      if (!this.isAdmin()) {
        alert("You need to be an admin");
        this.router.navigate(['main']);
      }
      this.dishForm = this.formBuilder.group({
        name: [''],
        cuisine: [''],
        category: [''],
        ingredients: [''],
        price: ['', Validators.pattern("^[0-9]+(.[0-9]{2})?$")],
        description: [''],
        photo1: [''],
        photo2: [''],
        max: ['', Validators.pattern("^[0-9]*$")],
        vegan: ['']
      })
    }

    onSubmit() {
      let obj = this.dishForm.value;
      obj.ingredients = obj.ingredients.split(',');
      obj.photos = [obj.photo1, obj.photo2];
      delete obj.photo1;
      delete obj.photo2;

      if (obj.vegan !== true) obj.vegan = false;
      obj.max = Number.parseInt(obj.max);
      obj.price = Number.parseFloat(obj.price);
      obj.origMax = obj.max;
      
      this.dishService.addDish(obj as Dish);
      this.router.navigate(['dishes']);
    }

    isLoggedIn(){
      return localStorage['user']!==undefined;
    }

    isAdmin() {
      if (!this.isLoggedIn()) return false;
      return localStorage['role'] === String(true);
    }
}
