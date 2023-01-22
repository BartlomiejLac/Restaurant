import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DishService } from '../dish.service';
import { Dish, sampleDish } from '../structures/Dish';
import { Review } from '../structures/Review';

@Component({
  selector: 'app-dish-close',
  templateUrl: './dish-close.component.html',
  styleUrls: ['./dish-close.component.css']
})
export class DishCloseComponent implements OnInit{
    id: string;
    dish: Dish = sampleDish();
    modal_img: HTMLImageElement;
    modal: HTMLElement;
    cross_btn: HTMLElement;
    reviewList: Review[];
    canReview: boolean = false;

    constructor(private dishService: DishService, private route: ActivatedRoute, private router: Router) {
      this.route.params.subscribe(params => {
        this.id = params['id'];
      })
      this.dishService.getDish(this.id).then((response) => {
        this.dish = response;
      }).catch(e => {
        this.router.navigate(['404']);
      })
      this.dishService.getAllReviews(this.id).then((response) => {
        this.reviewList = response;
      })
      if (this.isLoggedIn()){
        this.dishService.verifyIfUserCanReview(this.id).then(resp => {
          this.canReview = resp;
        })
      }
    }

    ngOnInit() {
      this.modal = document.getElementById('mod') as HTMLElement;
      this.modal_img = document.getElementById('modimg') as HTMLImageElement;
      this.cross_btn = document.getElementById('cross') as HTMLElement;
      };

    setModalToImg(src: string){
      this.modal.style.display = 'block';
      this.modal_img.src = src;
    }

    submitReview() {
      let ratingSelector = document.getElementById('ratingselector') as HTMLSelectElement;
      let textField = document.getElementById('text') as HTMLTextAreaElement;
      if (textField.value === null || textField.value === "") return;
      this.dishService.addReview(this.id, Number.parseInt(ratingSelector.value), String(textField.value));
      alert("Review submitted");
      textField.value = "";
    }

    isLoggedIn(){
      return localStorage['user']!==undefined;
    }
}
