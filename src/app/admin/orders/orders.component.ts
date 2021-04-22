import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthData } from 'src/app/auth/auth-data.model';
import { ToastrService } from 'ngx-toastr';
import { Cart, ShoppingCartService } from 'src/app/my-order/shopping-cart.service';
import { OrederProduct, Product } from '../product.model';
import { ProductsService } from '../products.service';
import { AuthService } from 'src/app/auth/auth.service';
import { ThemeService } from 'src/app/theme.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit, OnDestroy {

  cartItem: Cart[] = [];
  allOrderId: Cart[] = [];
  userName: string = "";
  cartSub: Subscription;
  authSub: Subscription;
  isLoading: boolean = false;
  totalPrice:number = 0;
  product: OrederProduct[] = [];

  constructor(private cart: ShoppingCartService, private toastr: ToastrService, private productService: ProductsService, private authService: AuthService, public theme: ThemeService) {}

  async ngOnInit() {
    let cartItemData:any[] = [];
    let eData:any[]=[];
    let users:any[] = [];
    this.isLoading = true;
    this.cart.getCartItem();
    this.cartSub = await this.cart.getUpdatedCart().subscribe( async cartData => {
      console.log(cartData);
       cartData.forEach(async cartValue => {
         console.log(cartValue);
        this.cartItem.push({
          productId :cartValue.productId,
          userName: cartValue.userName,
          userShop: cartValue.userShop,
          creatorId: cartValue.userId,
          cartId:cartValue.cartId,
          orderStatus: cartValue.orderStatus,
        });
        console.log(this.cartItem);
      });
      await this.cartItem.forEach(async rawData=> {
        console.log(rawData.userName)
        await rawData.productId.forEach(async data => {
          await this.productService.getProduct(data.itemId).subscribe(async value => {
            console.log(this.product.length)
            if (this.product.length>0) {
              await this.product.forEach(async (productData) => {
                if(rawData.userName === productData.userName){
                  console.log("true")
                  await productData.products.push({
                    itemId: data.itemId,
                    itemImage: value.itemImgUrl,
                    itemFlavors: value.itemFlavors,
                    itemCategory: value.itemCategory,
                    itemMRP: value.itemMRP,
                    itemName: value.itemName,
                    quantity: data.productQty,
                    totalPrice: value.itemMRP * data.productQty,
                  })
                  productData.orderStatus = rawData.orderStatus,
                  productData.totalPrice += value.itemMRP * data.productQty
                }else {
                  await this.product.push({
                    cartId: rawData.cartId,
                    userName: rawData.userName,
                    userShop: rawData.userShop,
                    userId: rawData.creatorId,
                    products:[{
                      itemId: data.itemId,
                      itemImage: value.itemImgUrl,
                      itemFlavors: value.itemFlavors,
                      itemCategory: value.itemCategory,
                      itemMRP: value.itemMRP,
                      itemName: value.itemName,
                      quantity: data.productQty,
                      totalPrice: value.itemMRP * data.productQty,
                    }],
                    orderStatus: rawData.orderStatus,
                    totalPrice: value.itemMRP * data.productQty,
                  });
                }
              })
            } else {
              await this.product.push({
                cartId: rawData.cartId,
                userName: rawData.userName,
                userShop: rawData.userShop,
                userId: rawData.creatorId,
                products:[{
                  itemId: data.itemId,
                  itemImage: value.itemImgUrl,
                  itemFlavors: value.itemFlavors,
                  itemCategory: value.itemCategory,
                  itemMRP: value.itemMRP,
                  itemName: value.itemName,
                  quantity: data.productQty,
                  totalPrice: value.itemMRP * data.productQty,
                }],
                orderStatus: rawData.orderStatus,
                totalPrice: value.itemMRP * data.productQty,
              });
              console.log(this.product);
            }
          })
        })
      })
    })
    this.isLoading = false;
  }
  onConfirmOrder(
    product:OrederProduct,
    ){
    const creatorId = product.userId;
    const cartId = product.cartId;
    const index = this.product.indexOf(product)

    Swal.fire({
      title: 'Order Confirmation',
      text: "To Confirm this order click Confirm",
      icon: 'info',
      confirmButtonText: 'Confirm Order',
      cancelButtonText: 'Cancel Order',
      showCancelButton:true,
      allowEscapeKey:false,
      allowOutsideClick:false,
    }).then((result) => {
      if (result.value) {
        console.log(creatorId +" :: " + cartId  );
        this.isLoading = true;
        this.cart.confirmOrder(creatorId,cartId,"Confirm").subscribe(a => {
          this.product[index].orderStatus = a.orderStatus;
          this.isLoading = false;
          this.toastr.info("Order Confirm", " ", {
            timeOut:3000,
            progressBar:true,
          })
        });
      } else if (result.isDismissed) {
        console.log("order cancel")
        this.isLoading = true;
        this.cart.confirmOrder(creatorId,cartId,"Canceled").subscribe(a => {
          this.product[index].orderStatus = a.orderStatus;
          this.toastr.info("Order Canceled", " ", {
            timeOut:3000,
            progressBar:true,
          })
          this.isLoading = false;
        });;
      }
    })
  }

  ngOnDestroy(){
    this.cartSub.unsubscribe();
  }

}
