import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DishesComponent } from './dishes/dishes.component';

import { provideFirebaseApp, getApp, initializeApp } from "@angular/fire/app";
import { getFirestore, provideFirestore } from "@angular/fire/firestore";
import { environment } from '../environments/environment';
import { DishCreationComponentComponent } from './dish-creation-component/dish-creation-component.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { getAuth, provideAuth } from "@angular/fire/auth";
import { LoginComponent } from './login/login.component';
import { DishCloseComponent } from './dish-close/dish-close.component';
import { DishEditComponent } from './dish-edit/dish-edit.component';
import { AboutComponent } from './about/about.component';
import { OrdersComponent } from './orders/orders.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { PrivilegesComponent } from './privileges/privileges.component';


@NgModule({
  declarations: [
    AppComponent,
    DishesComponent,
    DishCreationComponentComponent,
    LoginComponent,
    DishCloseComponent,
    DishEditComponent,
    AboutComponent,
    OrdersComponent,
    PageNotFoundComponent,
    PrivilegesComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideFirestore(() => getFirestore()),
    provideAuth(() => getAuth()),
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { 
    
}
