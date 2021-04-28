import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { ShoppingCartService } from '../my-order/shopping-cart.service';
import { ThemeService } from '../theme.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit, OnDestroy {

  totalPrice:number = 0;
  productId: Object[] = [];
  productQty:any[] = [];
  userIsAuthenticated: any;
  authListenerSub: Subscription;
  constructor(public cart: ShoppingCartService, public theme: ThemeService,  private toastr: ToastrService, private authService:AuthService, private route: Router) { }

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
    const minusButton = document.getElementById('minus');
    const plusButton = document.getElementById('plus');
    const inputField = document.getElementById('input');
    console.log(inputField)

    // minusButton.addEventListener('click', event => {
    //   event.preventDefault();
    //   const currentValue = Number(inputField) || 0;
    //   inputField = currentValue - 1;
    // });

    // plusButton.addEventListener('click', event => {
    //   event.preventDefault();
    //   const currentValue = Number(inputField.value) || 0;
    //   inputField.value = currentValue + 1;
    // });
  }
  ngOnDestroy() {
    this.authListenerSub.unsubscribe();
  }

  addToCart() {
    if (this.userIsAuthenticated) {
      this.cart.createNewCart(this.productId, this.totalPrice)
      .subscribe(result => {
        this.toastr.success("Order Placed successfully", "",{
          timeOut:3000,
          progressBar:true,
        })
        this.cart.cartShow = [];
        localStorage.removeItem("cartItem")
      });
    }else {
      this.route.navigate(["/login"])
    }
  }
}
