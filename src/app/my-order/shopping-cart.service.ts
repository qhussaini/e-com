import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Address, Product } from '../admin/product.model';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ShoppingCartService {

  cartShow:CartShow[] = [];
  address:Address[];
  private cart:Cart[] = [];
  private myCart:Cart[] = [];
  private cartUpdate = new Subject<Cart[]>();
  private myCartUpdate = new Subject<Cart[]>();
  constructor(private http: HttpClient, private auth:AuthService, private route: Router) { }

  createNewCart(productId, totalPrice, address){
    const orderStatus = "Panding"
    const cart: Cart = { productId: {productId:productId, totalPrice:totalPrice}, orderStatus: orderStatus, address:address};
    console.log(cart);
    return this.http.post<{ message: string, cart: any }>(
      'http://localhost:3000/api/cart',
      cart
    )
  }
  getQuantity(product: Product) {
    return this.cartShow.forEach(item => {
      if(product.itemName == item.product.itemName){
        return item.productQty;
      }
      return 0;
    })
  }
  getCartItem(){
    this.http
      .get<{ message: string; cart: any }>("http://localhost:3000/api/cart")
      .pipe(
        map((cartData) => {
          console.log(cartData)
          return cartData.cart.map((cart) => {
            if(cart.product){
              return {
                productId: cart.product.productId,
                userId: cart.creatorId,
                userName: cart.creatorName,
                userShop: cart.creatorShop,
                cartId: cart._id,
                orderStatus:cart.orderStatus,
              };
            }else {
              return {
                productId: null
            };
            }
          });
        })
      )
      .subscribe((transformPosts) => {
        this.cart = transformPosts;
        this.cartUpdate.next([...this.cart]);
      });
  }
  getMyCartItem(){
    this.http
      .get<{ message: string; cart: any }>("http://localhost:3000/api/cart/client")
      .pipe(
        map((cartData) => {
          return cartData.cart.map((cart) => {
            console.log(cart.product.productId)
            if(cart.product){
              return {
                productId: cart.product.productId,
                creatorId: cart.creatorId,
                userName: cart.creatorName,
                userShop: cart.creatorShop,
                orderStatus:cart.orderStatus,
              };
            }else {
              return {
                productId: null
            };
            }
          });
        })
      )
      .subscribe((transformPosts) => {
        this.myCart = transformPosts;
        this.myCartUpdate.next([...this.myCart]);
      });
  }

  getOrderPlaced(orderId){
    return this.http.get<{message:string, order:any}>("http://localhost:3000/api/cart/order/"+orderId)
  }

  // confirmOrder(cartId:string, ){

  //   this.http.put<{message: string}>("http://localhost:3000/api/cart/" + cartId,)
  // }

  getUpdatedCart(){
    return this.cartUpdate.asObservable();
  }

  getUpdatedMyCart(){
    return this.myCartUpdate.asObservable();
  }


  private getCart(cartId: string){
   return this.http.get<{ message:string, cart: any}>('http://localhost:3000/api/admin/products/cart/' + cartId);
  }

  confirmOrder(
    creatorId: string,
    cartId:string,
    status: string,
  ) {
    const confirmOrder = {cartId:cartId, creatorId:creatorId, orderStatus: status};
    console.log(confirmOrder)
    return this.http.put<{ message:string, orderStatus:string }>("http://localhost:3000/api/cart/update/"+cartId, confirmOrder)
  }


  // addToCart(productId, totalPrice){
  //   console.log(totalPrice);
  //   this.createNewCart(productId, totalPrice);
  // }


}
export interface Cart {
  productId: any;
  creatorId?:string;
  userId?:string;
  userName?:string;
  userShop?:string;
  allOrderId?: string;
  productQty?: number;
  cartId?:string;
  orderStatus?: string;
  address?:Address
}
export interface CartShow {
  product: Product;
  productQty: number;
  totalPrice: number;
}
