import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DishService } from '../dish.service';
import { Order, OrderTemp } from '../structures/Order';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent {

  ordersList: Order[] = [];

  constructor(private dishService: DishService, private router: Router){
    if (!this.isLoggedIn()) {
      alert("You need to be logged in");
      this.router.navigate(['main']);
    }

    this.dishService.getAllOrders().then((response) => {
      this.ordersList = response;
    })
    
  }

  getListFromOrder(order: Order){
    let tempList: OrderTemp[] = [];
    order.dishIds.forEach((id, index) => {
      let obj: OrderTemp = {
        dishId: id,
        dishName: order.dishNames[index],
        dishCount: order.dishCounts[index]
      };
      tempList.push(obj);
    });
    return tempList;
  }

  isLoggedIn(){
    return localStorage['user']!==undefined;
  }
}
