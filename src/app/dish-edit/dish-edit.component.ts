import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DishService } from '../dish.service';
import { Dish } from '../structures/Dish';

@Component({
  selector: 'app-dish-edit',
  templateUrl: './dish-edit.component.html',
  styleUrls: ['./dish-edit.component.css']
})
export class DishEditComponent {
  public dishForm: FormGroup;
  id: string;
  dish: Dish;

    constructor(
      public dishService : DishService,
      public formBuilder : FormBuilder,
      public router : Router,
      private route: ActivatedRoute
    ) {
      if (!this.isAdmin()) {
        alert("You need to be an admin");
        this.router.navigate(['main']);
      }
      this.route.params.subscribe(params => {
        this.id = params['id'];
      })
      this.dishService.getDish(this.id).then((response) => {
        this.dish = response;
        this.initDishForm();
      }).catch(e => {
        this.router.navigate(['404']);
      })
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

    initDishForm(){
      this.dishForm = this.formBuilder.group({
        name: [this.dish.name],
        cuisine: [this.dish.cuisine],
        category: [this.dish.category],
        ingredients: [this.dish.ingredients.join(',')],
        price: [this.dish.price.toString(), Validators.pattern("^[0-9]+(.[0-9]{2})?$")],
        description: [this.dish.description],
        photo1: [this.dish.photos[0]],
        photo2: [this.dish.photos[1]],
        max: [this.dish.origMax.toString(), Validators.pattern("^[0-9]*$")],
        vegan: [this.dish.vegan]
      })
    }

    onSubmit() {
      let obj = this.dishForm.value;
      obj.ingredients = obj.ingredients.split(',');
      obj.photos = [obj.photo1, obj.photo2];
      delete obj.photo1;
      delete obj.photo2;

      if (obj.vegan !== true) obj.vegan = false;
      obj.origMax = Number.parseInt(obj.max);
      obj.price = Number.parseFloat(obj.price);
      obj.reviewAvg = this.dish.reviewAvg;
      
      this.dishService.editDish(this.id, obj as Dish);
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
