import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { AppComponent } from './app.component';
import { DishCloseComponent } from './dish-close/dish-close.component';
import { DishCreationComponentComponent } from './dish-creation-component/dish-creation-component.component';
import { DishEditComponent } from './dish-edit/dish-edit.component';
import { DishesComponent } from './dishes/dishes.component';
import { LoginComponent } from './login/login.component';
import { OrdersComponent } from './orders/orders.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { PrivilegesComponent } from './privileges/privileges.component';

const routes: Routes = [
  {path: '', redirectTo: '/about', pathMatch:'full'},
  {path: 'main', redirectTo: '/about'},
  {path: 'about', component: AboutComponent},
  {path: 'dishes', component: DishesComponent},
  {path: 'create', component: DishCreationComponentComponent},
  {path: 'login', component: LoginComponent},
  {path: 'dish/:id', component: DishCloseComponent},
  {path: 'edit/:id', component: DishEditComponent},
  {path: 'orders', component: OrdersComponent},
  {path: 'privileges', component: PrivilegesComponent},
  {path: '**', component: PageNotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {scrollPositionRestoration: 'enabled'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
