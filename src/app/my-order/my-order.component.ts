import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { ThemeService } from '../theme.service';
import { ShoppingCartService } from './shopping-cart.service';

@Component({
  selector: 'app-my-order',
  templateUrl: './my-order.component.html',
  styleUrls: ['./my-order.component.scss']
})
export class MyOrderComponent implements OnInit, OnDestroy {

  totalPrice:number = 0;
  productId: Object[] = [];
  productQty:any[] = [];
  userIsAuthenticated: any;
  authListenerSub: Subscription;
  constructor(public cart: ShoppingCartService, public theme: ThemeService, private authService:AuthService, private route: Router) { }

  ngOnInit() {
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authListenerSub = this.authService.getUserAuthStatus().subscribe(isAuthenticated => {
      this.userIsAuthenticated = isAuthenticated
    });
    this.cart.cartShow.forEach((value) => {
      this.totalPrice += value.totalPrice
      let itemId = value.product.itemId
      let productQty = value.productQty
      this.productId.push({itemId:itemId, productQty: productQty})
      console.log(this.productId)
      // this.productQty.push(value.productQty)
    })
  }
  ngOnDestroy() {
    this.authListenerSub.unsubscribe();
  }

  addToCart() {
    if (this.userIsAuthenticated) {
      this.cart.createNewCart(this.productId, this.totalPrice);
    }else {
      this.route.navigate(["/login"])
    }
  }

}
