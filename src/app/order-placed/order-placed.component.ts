import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { ProductsService } from '../admin/products.service';
import { AuthService } from '../auth/auth.service';
import { ShoppingCartService } from '../my-order/shopping-cart.service';
import { ThemeService } from '../theme.service';

@Component({
  selector: 'app-order-placed',
  templateUrl: './order-placed.component.html',
  styleUrls: ['./order-placed.component.scss']
})
export class OrderPlacedComponent implements OnInit {

  isLoading:boolean = false;
  placedOrder:any;
  orderedProduct:any[] = [];
  qty:any[]=[];

  constructor(public theme: ThemeService, private auth: AuthService, private products: ProductsService, private route: ActivatedRoute, private cart: ShoppingCartService) { }

  ngOnInit() {
    this.isLoading = true;
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has("orderId")) {
        const orderId = paramMap.get("orderId");
        console.log(orderId);
        this.cart.getOrderPlaced(orderId).subscribe((data) => {
          this.placedOrder = data.order;
          console.log(this.placedOrder.product);
          this.placedOrder.product.productId.forEach(val =>{
            this.products.getProduct(val.itemId).subscribe((product) => {
              this.orderedProduct.push(product);
              this.qty.push(val.productQty);
              console.log(this.orderedProduct);
            })
          })
          this.isLoading = false;
        })
      }
    })
  }

}
