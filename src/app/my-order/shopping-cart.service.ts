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

  createNewOrder(productId, totalPrice, date, address, payInfo?:any ){
    const orderStatus = "Pending"
    let payment = payInfo? payInfo : "pod";
    const order: Cart = { productId: {productId:productId, totalPrice:totalPrice}, orderStatus: orderStatus, payInfo:payment, orderDate: date, address:address};
    console.log(order);
    return this.http.post<{ message: string, order: any }>(
      'http://localhost:3000/api/orders',
      order
    )
  }

  getMyOrderDetails(orderId){
    return this.http.get<{message: string, order:any}>('http://localhost:3000/api/orders/myOrder/'+orderId)
  }
  getOrderDetailsAd(orderId, userId){
    return this.http.get<{message: string, order:any}>('http://localhost:3000/api/orders/orderAd/'+orderId+'/'+userId)
  }

  createNewCart() {
    let totalPrice
    let cartItem:any[] = []
    const cart: Cart = { productId: {productId:cartItem, totalPrice:totalPrice}};
    console.log(cart);
    return this.http.post<{ message: string, cart: any }>(
      'http://localhost:3000/api/cart/create',
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
  getCartId(){
    return this.http.get<{cart:Cart, message:string}>('http://localhost:3000/api/cart');
  }
  deleteCart(id){
    return this.http.delete<{message:string}>('http://localhost:3000/api/cart/myCart/'+id);
  }
  updateCart(cartId){
    let totalPrice = 0
    let cartItem:any[] = []
    this.cartShow.forEach((value) => {
      totalPrice += value.totalPrice
      console.log(value.product)
      let itemId = value.product.itemId
      let productQty = value.productQty
      cartItem.push({itemId:itemId, productQty: productQty})
      console.log(cartItem)
      // this.productQty.push(value.productQty)
    });
    const cart: Cart = { productId: {productId:cartItem, totalPrice:totalPrice}};
    console.log(cart);
    return this.http.put<{ message: string, cart: any }>(
      'http://localhost:3000/api/cart/update/'+cartId,
      cart
    )
  }

  getCartItem(){
    this.http
      .get<{ message: string; cart: any }>("http://localhost:3000/api/orders")
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
                orderId: cart._id,
                orderStatus:cart.orderStatus,
                orderDate: cart.orderDate,
                payInfo: cart.payInfo
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
      .get<{ message: string; cart: any }>("http://localhost:3000/api/orders/client")
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
    return this.http.get<{message:string, order:any}>("http://localhost:3000/api/orders/order/"+orderId)
  }

  // confirmOrder(cartId:string, ){

  //   this.http.put<{message: string}>("http://localhost:3000/api/orders/" + cartId,)
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
    return this.http.put<{ message:string, orderStatus:string }>("http://localhost:3000/api/orders/update/"+cartId, confirmOrder)
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
  orderId?:string;
  orderStatus?: string;
  address?:Address;
  _id?:string;
  creatorName?:string;
  creatorShop?:string;
  product?:any;
  orderDate?: any;
  payInfo?:any;
}
export interface CartShow {
  product: Product;
  productQty: number;
  totalPrice: number;
  cartId?: string;
}
