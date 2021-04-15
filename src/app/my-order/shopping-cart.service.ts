import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Product } from '../admin/product.model';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ShoppingCartService {

  cartShow:CartShow[] = [];
  private cart:Cart[] = [];
  private cartUpdate = new Subject<Cart[]>();
  constructor(private http: HttpClient, private auth:AuthService, private route: Router) { }

  createNewCart(productId, totalPrice){
    const cart: Cart = { productId: {productId:productId, totalPrice:totalPrice}};
    console.log(cart);
    this.http.post<{ message: string, cart: any }>(
      'http://localhost:3000/api/cart',
      cart
    )
      .subscribe(result => {
        console.log(result);
      })
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
                userId: cart.creator
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
        console.log(transformPosts);
        this.cart = transformPosts;
        this.cartUpdate.next([...this.cart]);
      });
  }
  getUpdatedCart(){
    return this.cartUpdate.asObservable();
  }


  private getCart(cartId: string){
   return this.http.get<{ message:string, cart: any}>('http://localhost:3000/api/admin/products/cart/' + cartId);
  }

  // private getOrCreateCartId(productId, productQty){
  //   let cartId = localStorage.getItem('cartId');
  //   if (cartId){
  //     return cartId;
  //   } else {
  //     this.createNewCart(productId, productQty).subscribe(result => {
  //       // localStorage.setItem('cartId', result.cart._id)
  //       return result.cart
  //     });
  //   }
  // }

  addToCart(productId, totalPrice){
    console.log(totalPrice);
    this.createNewCart(productId, totalPrice);

    // let cartItem = this.getCart(cartId).subscribe(r => {
    //   // console.log(r)
    //   // if (product.itemId === r.cart.items.productId) {
    //   //   console.log(r.cart.items.quantity);
    //   //   console.log(r.cart.items.quantity+1);
    //   // }else {
    //   //   console.log("not added")
    //   // }
    // })
  }


}
export interface Cart {
  productId: any;
  userId?:string;
  allOrderId?: string;
  productQty?: number;
}
export interface CartShow {
  product: Product;
  productQty: number;
  totalPrice: number;
}
