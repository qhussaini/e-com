import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthData } from 'src/app/auth/auth-data.model';
import { Cart, ShoppingCartService } from 'src/app/my-order/shopping-cart.service';
import { OrederProduct, Product } from '../product.model';
import { ProductsService } from '../products.service';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit, OnDestroy {

  cartItem: Cart[] = [];
  allOrderId: Cart[] = [];
  userName: string;
  cartSub: Subscription;
  isLoading: boolean = false;
  totalPrice:number = 0;
  product: OrederProduct[] = [];

  constructor(private cart: ShoppingCartService, private productService: ProductsService, private authService: AuthService) {}

  async ngOnInit() {
    this.isLoading = true;
    this.cart.getCartItem();
    this.cartSub = await this.cart.getUpdatedCart().subscribe( data => {
       data.forEach(value => {
        this.cartItem.push({productId :value.productId, userId: value.userId});
        this.authService.getClientData(value.userId);
        this.authService.getUpdateClientName().subscribe(user => {
          this.userName = user;
        })
      });
      this.cartItem.forEach(data => {
        data.productId.forEach(element => {
          this.allOrderId.push({productId: element.itemId, productQty: element.productQty })
        });
        this.allOrderId.forEach(ids => {
          console.log(ids)
          this.productService.getProduct(ids.productId).subscribe(value => {
            // tp += value.itemMRP * ids.productQty;
            this.product.push({
              userName: this.userName,
              products:[{
                itemImage: value.itemImgUrl,
                itemFlavors: value.itemFlavors,
                itemCategory: value.itemCategory,
                itemMRP: value.itemMRP,
                itemName: value.itemName,
                quantity: ids.productQty,
                totalPrice: value.itemMRP * ids.productQty,
              }],
              totalPrice: value.itemMRP * ids.productQty,
            });
            console.log(this.product)
            this.isLoading = false;
          })
        })
        console.log(this.allOrderId)
      })
    })

  }

  ngOnDestroy(){
    this.cartSub.unsubscribe();
  }

}
