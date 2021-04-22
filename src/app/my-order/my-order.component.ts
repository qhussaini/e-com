import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Product } from '../admin/product.model';
import { ProductsService } from '../admin/products.service';
import { AuthService } from '../auth/auth.service';
import { ThemeService } from '../theme.service';
import { Cart, ShoppingCartService } from './shopping-cart.service';

@Component({
  selector: 'app-my-order',
  templateUrl: './my-order.component.html',
  styleUrls: ['./my-order.component.scss']
})
export class MyOrderComponent implements OnInit, OnDestroy {

  totalPrice:number = 0;
  productId: Object[] = [];
  productQty:any[] = [];
  statusBar="";
  myCart: Cart[]= [];
  cartItem: Cart[] = [];
  products: Product[] = [];
  userIsAuthenticated: any;
  cartSub: Subscription;
  isLoading: boolean = false;
  constructor(public cart: ShoppingCartService, private productService: ProductsService, public theme: ThemeService, private authService:AuthService, private route: Router) { }

  async ngOnInit() {
    this.isLoading = true;
    this.cart.getMyCartItem()
    this.cartSub = await this.cart.getUpdatedMyCart().subscribe( async cartData => {
      console.log(cartData);
       cartData.forEach(async cartValue => {
         console.log(cartValue)
        this.cartItem.push({productId :cartValue.productId, userName: cartValue.userName, userShop:cartValue.userShop, orderStatus: cartValue.orderStatus});
        console.log(this.cartItem);
      });
      await this.cartItem.forEach(async rawData=> {
        console.log(rawData.productId)
        await rawData.productId.forEach(async data => {
          console.log(data)
          await this.productService.getProduct(data.itemId).subscribe(async value => {
            await this.products.push({
                  itemImage: value.itemImgUrl,
                  itemFlavors: value.itemFlavors,
                  itemCategory: value.itemCategory,
                  itemMRP: value.itemMRP,
                  itemName: value.itemName,
                  quantity: data.productQty,
                  totalPrice: value.itemMRP * data.productQty,
                  orderStatus: rawData.orderStatus,
            });
            if (rawData.orderStatus==="Panding") {
              this.statusBar = 'warning'
            }else if(rawData.orderStatus==="Canceled") {
              this.statusBar = 'danger'
            }else {
              this.statusBar = 'success'
            }
            this.totalPrice += value.itemMRP * data.productQty;
          })
        })
      })
      console.log(this.products);
      this.isLoading = false;
    })
  }
  ngOnDestroy() {
    this.cartSub.unsubscribe();
  }



}
