import { Component, Input, OnInit } from '@angular/core';
import { Dish } from '../structures/Dish'
import { Router, RouterStateSnapshot } from '@angular/router';
import { Observable, map } from 'rxjs';
import { DishService } from '../dish.service';
import { Order, OrderTemp } from '../structures/Order';


@Component({
  selector: 'app-dishes',
  templateUrl: './dishes.component.html',
  styleUrls: ['./dishes.component.css']
})
export class DishesComponent implements OnInit{

  dishList: Dish[] = [];
  currentOrder: OrderTemp[] = [];
  totalOrdered = 0;
  totalPrice = 0.0
  filteredDishes : Dish[] = []
  availableCuisines : string[] = [];
  availableCategories: string[] = [];
  minValue : HTMLSpanElement;
  maxValue : HTMLSpanElement;
  minSlider : HTMLInputElement;
  maxSlider : HTMLInputElement;

  constructor(private dishService: DishService, public router : Router) { 
    this.dishService.getDishList().then((response) => {
      this.dishList = response;
      this.getItStarted();
    })
  }

  ngOnInit(): void {
    this.minValue = document.getElementById("min-value") as HTMLSpanElement;
    this.maxValue = document.getElementById("max-value") as HTMLSpanElement;
    this.minSlider = document.getElementById("min-slider") as HTMLInputElement;
    this.maxSlider = document.getElementById("max-slider") as HTMLInputElement;
  }

  getItStarted() {
    this.filteredDishes = this.dishList;
    for (let dish of this.filteredDishes){
      if (!this.availableCuisines.includes(dish.cuisine)) this.availableCuisines.push(dish.cuisine);
      if (!this.availableCategories.includes(dish.category)) this.availableCategories.push(dish.category);
    }
    this.updatePriceRange();
  }

  orderDish(dish : Dish){
    if (dish.orderedCount >= dish.max) return;
    dish.orderedCount++;
    this.totalOrdered++;
    this.totalPrice = Math.round((this.totalPrice + dish.price) * 100)/100;
    let existing = this.currentOrder.filter(e => e.dishName === dish.name);
    if (existing.length > 0) {
      existing.forEach(o => {
        o.dishCount++;
      })
    } else {
      let obj: OrderTemp = {
        dishId: dish.id,
        dishName: dish.name,
        dishCount: 1
      };
      this.currentOrder.push(obj);
    }
  }
  
  unorderDish(dish: Dish){
    if (dish.orderedCount == 0) return;
    dish.orderedCount--;
    this.totalOrdered--;
    this.totalPrice = Math.round((this.totalPrice - dish.price) * 100)/100;
    let existing = this.currentOrder.filter(e => e.dishName === dish.name);
    existing.forEach(o => {
      o.dishCount--;
      if (o.dishCount === 0) {
        let index = this.currentOrder.indexOf(o);
        this.currentOrder.splice(index, 1)
      }
    })
  }

  isTheMostExpensive(dish: Dish){
    for (let otherdish of this.filteredDishes){
      if (otherdish.price > dish.price) return false;
    }
    return true;
  }

  isTheLeastExpensive(dish: Dish){
    for (let otherdish of this.filteredDishes){
      if (otherdish.price < dish.price) return false;
    }
    return true;
  }

  deleteDish(dish: Dish){
    if(confirm("Are you sure you want to delete " + dish.name)){
      while (dish.orderedCount > 0) this.unorderDish(dish);
      let index = this.dishList.indexOf(dish);
      this.dishList.splice(index, 1);
      this.updatePriceRange();
      this.dishService.deleteDish(dish.id);
    }
  }


  filterData(){
    let cuisineSelector = document.getElementById('cuisineselector') as HTMLSelectElement;
    let categorySelector = document.getElementById('categoryselector') as HTMLSelectElement;
    let ratingSelector = document.getElementById('ratingselector') as HTMLSelectElement;
    let isVegan = document.getElementById('isvegan') as HTMLInputElement;
    let minPrice = Number.parseFloat(this.minSlider.value);
    let maxPrice = Number.parseFloat(this.maxSlider.value);
    this.filteredDishes = this.dishList.filter((obj: { cuisine: string; category: string; price: number; reviewAvg: number; vegan: any; }) => {
      let isCuisine = String(cuisineSelector.value) == "Any" || obj.cuisine === String(cuisineSelector.value)
      let isCategory = String(categorySelector.value) == "Any" || obj.category === String(categorySelector.value)
      let isInRange = obj.price >= minPrice && obj.price <= maxPrice;
      let isReview = obj.reviewAvg >= Number.parseInt(ratingSelector.value)
      return isCuisine && isCategory && isReview && (obj.vegan || !isVegan.checked) && isInRange;
    })
  }

  updatePriceRange() {
    let min = 0;
    let max = 0;
    for (let dish of this.filteredDishes){
      if (dish.price > max){
        max = dish.price;
      }
      if (min == 0 || dish.price < min){
        min = dish.price;
      }
    }
    this.minSlider.min = String(min);
    this.minSlider.max = String(max);
    this.maxSlider.min = String(min);
    this.maxSlider.max = String(max);
    this.validateRange();
  }

  validateRange() {
    let minPrice = Number.parseFloat(this.minSlider.value);
    let maxPrice = Number.parseFloat(this.maxSlider.value);

    if (minPrice > maxPrice) {
      let tempValue = maxPrice;
      maxPrice = minPrice;
      minPrice = tempValue;
    }  
    this.minValue.innerHTML = "$" + minPrice;
    this.maxValue.innerHTML = "$" + maxPrice;
    this.filterData();
  }

  order() {
    let obj: Order = {
      dishIds: this.currentOrder.map(e => e.dishId),
      dishNames: this.currentOrder.map(e => e.dishName),
      dishCounts: this.currentOrder.map(e => e.dishCount),
      date: (new Date()).toDateString()
    };
    this.dishService.addOrder(obj);
    this.router.navigate(['main']);
  }
  
  resetOrder() {
    for (let dish of this.filteredDishes){
      while (dish.orderedCount > 0) this.unorderDish(dish);
    }
  }

  isLoggedIn(){
    return localStorage['user']!==undefined;
  }

  isAdmin() {
    if (!this.isLoggedIn()) return false;
    return localStorage['role'] === String(true);
  }
}



