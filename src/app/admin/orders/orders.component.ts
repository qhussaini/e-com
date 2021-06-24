import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthData } from 'src/app/auth/auth-data.model';
import { ToastrService } from 'ngx-toastr';
import { Cart, ShoppingCartService } from 'src/app/my-order/shopping-cart.service';
import { OrederProduct, Product } from '../product.model';
import { ProductsService } from '../products.service';
import { AuthService } from 'src/app/auth/auth.service';
import { ThemeService } from 'src/app/theme.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit, OnDestroy {

  orderItem: Cart[] = [];
  allOrderId: Cart[] = [];
  userName: string = "";
  cartSub: Subscription;
  authSub: Subscription;
  isLoading: boolean = false;
  totalPrice:number = 0;
  product: OrederProduct[] = [];

  constructor(private modalService: NgbModal, private cart: ShoppingCartService, private toastr: ToastrService, private productService: ProductsService, private authService: AuthService, public theme: ThemeService) {}

  async ngOnInit() {
    let cartItemData:any[] = [];
    let eData:any[]=[];
    let users:any[] = [];
    this.isLoading = true;
    this.cart.getCartItem();
    this.cartSub = await this.cart.getUpdatedCart().subscribe( async cartData => {
      console.log(cartData);
       await cartData.forEach(cartValue => {
         console.log(cartValue);
         let date = new Date(cartValue.orderDate);
         this.orderItem.push({
          productId :cartValue.productId,
          userName: cartValue.userName,
          userShop: cartValue.userShop,
          creatorId: cartValue.userId,
          orderId: cartValue.orderId,
          orderStatus: cartValue.orderStatus,
          orderDate: date,
          payInfo: cartValue.payInfo
        });
        console.log(this.orderItem);
        this.orderItem.forEach(async rawData=> {
          console.log(rawData.userName)
          await rawData.productId.forEach(data => {
             this.productService.getProduct(data.itemId).subscribe( value => {
              console.log(this.product.length)
              if (this.product.length>0) {
                this.product.forEach((productData) => {
                  if(rawData.userName === productData.userName){
                    productData.products.push({
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
                    productData.orderDate = rawData.orderDate,
                    productData.payInfo = rawData.payInfo,
                    productData.totalPrice += value.itemMRP * data.productQty
                  }else {
                    this.product.push({
                      orderId: rawData.orderId,
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
                      orderDate: rawData.orderDate,
                      payInfo: rawData.payInfo,
                      totalPrice: value.itemMRP * data.productQty,
                    });
                  }
                })
              } else {
                this.product.push({
                  orderId: rawData.orderId,
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
                  orderDate: rawData.orderDate,
                  payInfo: rawData.payInfo,
                  totalPrice: value.itemMRP * data.productQty,
                });
                console.log(this.product);
              }
            })
          })
        })
      });
    })
    this.isLoading = false;
  }

  open(content) {
    this.modalService.open(content);
  }

  onConfirmOrder(
    product:OrederProduct,
    ){
    const creatorId = product.userId;
    const cartId = product.orderId;
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
        this.cart.confirmOrder(creatorId,cartId,"Confirmed").subscribe(a => {
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
        this.cart.confirmOrder(creatorId,cartId,"Cancelled").subscribe(a => {
          this.product[index].orderStatus = a.orderStatus;
          this.toastr.info("Order Canceled", " ", {
            timeOut:3000,
            progressBar:true,
          })
          this.isLoading = false;
        });
      }
    })
  }

  ngOnDestroy(){
    this.cartSub.unsubscribe();
  }

}
