import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HeaderComponent } from './header/header.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';

import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MyOrderComponent } from './my-order/my-order.component';
import { HomeComponent } from './home/home.component';
import { NewProductComponent } from './admin/new-product/new-product.component';
import { OrdersComponent } from './admin/orders/orders.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { AdminProductComponent } from './admin/admin-product/admin-product.component';

@NgModule({
  declarations: [
    AppComponent,
      HeaderComponent,
      MyOrderComponent,
      HomeComponent,
      AdminProductComponent,
      NewProductComponent,
      OrdersComponent,
      LoginComponent,
      SignupComponent,
   ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    BrowserAnimationsModule,
    MatSlideToggleModule,
    FormsModule,
    MatIconModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
