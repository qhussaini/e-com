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

  isLoading: boolean = false;
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
    this.getTotal();
  }

  ngOnDestroy() {
    this.authListenerSub.unsubscribe();
    console.log(1)
  }
  async getTotal(){
    this.totalPrice = 0
     await this.cart.cartShow.forEach((value) => {
      this.totalPrice += value.totalPrice
      let itemId = value.product.itemId
      let productQty = value.productQty
      // this.productId.push({itemId:itemId, productQty: productQty})
    })
  }

  updateTotal(i:number, event,cartId){
    let change = event.target.value
    this.cart.cartShow[i].totalPrice = change * this.cart.cartShow[i].product.itemMRP
    this.getTotal();
    this.cart.updateCart(cartId).subscribe((updatedData) => {
      this.getTotal();
      console.log(updatedData.cart);
    })
    // localStorage.setItem("cartItem", JSON.stringify(this.cart.cartShow));
  }

  increment(qty,i,cartId) {
    qty.value++
    let change = qty.value
    this.cart.cartShow[i].productQty = change
    this.cart.cartShow[i].totalPrice = change * this.cart.cartShow[i].product.itemMRP
    this.getTotal();
    this.cart.updateCart(cartId).subscribe((updatedData) => {
      this.getTotal();
      console.log(updatedData.cart);
    })
  }
  decrement(qty,i,cartId) {
    if (qty.value>1){
      qty.value--
      let change = qty.value
      this.cart.cartShow[i].productQty = change
      this.cart.cartShow[i].totalPrice = change * this.cart.cartShow[i].product.itemMRP
      this.getTotal();
      this.cart.updateCart(cartId).subscribe((updatedData) => {
        this.getTotal();
        console.log(updatedData.cart);
      })
    }else {
      this.deleteItem(i,cartId);
    }
  }
  deleteItem(deleteItem,cartId){
    this.isLoading = true;
    this.cart.cartShow.splice(deleteItem,1);
    this.cart.updateCart(cartId).subscribe((updatedData) => {
      this.isLoading = false;
      this.getTotal();
      console.log(updatedData.cart);
    })
  }

  addToCart() {
    if (this.userIsAuthenticated) {
      this.route.navigate(["/check-out"])
      // this.cart.createNewCart(this.productId, this.totalPrice)
      // .subscribe(result => {
      //   this.toastr.success("Order Placed successfully", "",{
      //     timeOut:3000,
      //     progressBar:true,
      //   })
      //   this.cart.cartShow = [];
    //   localStorage.removeItem("cartItem")
      // });
    }else {
      this.route.navigate(["/login"])
    }
  }
}
