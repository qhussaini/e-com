import { OverlayContainer } from '@angular/cdk/overlay';
import { ISlimScrollOptions, SlimScrollEvent } from 'ngx-slimscroll';
import { Component, EventEmitter, OnDestroy, OnInit } from '@angular/core';
import { MatBottomSheet, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { AuthService } from './auth/auth.service';
import { ThemeService } from './theme.service';
import { MediaObserver, MediaChange } from '@angular/flex-layout';
import { Subscription } from 'rxjs';
import { ShoppingCartService } from './my-order/shopping-cart.service';
import { ProductsService } from './admin/products.service';
import { Product } from './admin/product.model';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy{
  title = 'ecom-ice';
  mediaSub: Subscription;
  isHome:boolean = true;
  opts: ISlimScrollOptions;
  scrollEvents: EventEmitter<SlimScrollEvent>;


  constructor(
    public theme:ThemeService,
    private _bottomSheet: MatBottomSheet,
    private auth: AuthService,
    private overlay:OverlayContainer,
    public mediaObserver: MediaObserver,
    private cart: ShoppingCartService,
    private route: Router,
    private productService:ProductsService,
    ) {}

  ngOnInit(){
    this.route.events.subscribe((val) =>{
      this.isHome = this.route.url === "/";
      if (this.auth.getIsAuth()) {
        // this.cart.address = JSON.parse(localStorage.getItem("address"));
        // this.cart.cartShow = JSON.parse(localStorage.getItem("cartItem") || "[]");

          this.auth.getAddress().subscribe((data) => {
            this.cart.address = data
          });
      } else {
        // this.cart.cartShow = [];
      }
    })
    this.scrollEvents = new EventEmitter<SlimScrollEvent>();
    this.opts = {
      barBackground:  '#C9C9C9',
      barOpacity: '0.8',
      barWidth: '10',
    }
    this.theme.logo = "assets/images/logo/scoops-logo.png";
    this.theme.comName = "Azam Scoops"

    // this.play();


    this.mediaSub = this.mediaObserver.media$.subscribe((result: MediaChange) => {
      this.theme.deviceXs = result.mqAlias === 'xs' ? true : false;
      if(this.theme.deviceXs) {
        this.theme.sideBar = "over"
      }else {
        this.theme.sideBar = "side"
      }
    })
    this.theme.getThemeColor();
    this.theme.getThemeChange()
    // if (this.auth.getIsAuth()) {
    //   this.cart.cartShow = JSON.parse(localStorage.getItem("cartItem") || "[]");
    // }
    setTimeout(()=>{
      var isLogedin = null
      isLogedin = localStorage.getItem('token');
      if (isLogedin===null && !this.auth.isSigning) {
        this._bottomSheet.open(BottomSheet);
      }
    },60000*5)
    this.auth.autoAuthUser();
    this.setCart();
  }

  async setCart(){
    await this.cart.getCartId().subscribe((cartData) => {
      if (cartData.cart) {
        cartData.cart.product.productId.forEach(async cartItem => {
          console.log(cartItem.itemId);
          console.log(cartData.cart._id);
          let products:Product[]=[];
          this.cart.cartShow = []
          if(cartItem.itemId){
            await this.productService.getProduct(cartItem.itemId).subscribe((productData) => {
              this.cart.cartShow.push({
                product:{
                  itemId: productData._id,
                  itemName: productData.itemName,
                  itemMRP: productData.itemMRP,
                  itemCategory: productData.itemCategory,
                  itemFlavors: productData.itemFlavors,
                  itemImage: productData.itemImgUrl,
                },
                productQty:cartItem.productQty,
                totalPrice:cartItem.productQty*productData.itemMRP,
                cartId:cartData.cart._id
              })
            })
          } else {
            alert('internal error')
          }
          console.log(this.cart.cartShow);
        })
      }
    })
  }

  ngOnDestroy(){
    this.mediaSub.unsubscribe();
  }

  // play(): void {
  //   let event = null;

  //   Promise.resolve()
  //     .then(() => this.timeout(3000))
  //     .then(() => {
  //       event = new SlimScrollEvent({
  //         type: 'scrollToBottom',
  //         duration: 2000,
  //         easing: 'inOutQuad'
  //       });

  //       this.scrollEvents.emit(event);
  //     })
  //     .then(() => this.timeout(3000))
  //     .then(() => {
  //       event = new SlimScrollEvent({
  //         type: 'scrollToTop',
  //         duration: 3000,
  //         easing: 'outCubic'
  //       });

  //       this.scrollEvents.emit(event);
  //     })
  //     .then(() => this.timeout(4000))
  //     .then(() => {
  //       event = new SlimScrollEvent({
  //         type: 'scrollToPercent',
  //         percent: 80,
  //         duration: 1000,
  //         easing: 'linear'
  //       });

  //       this.scrollEvents.emit(event);
  //     })
  //     .then(() => this.timeout(2000))
  //     .then(() => {
  //       event = new SlimScrollEvent({
  //         type: 'scrollTo',
  //         y: 200,
  //         duration: 4000,
  //         easing: 'inOutQuint'
  //       });

  //       this.scrollEvents.emit(event);
  //     });
  // }

  timeout(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(() => resolve(), ms));
  }


}


@Component({
  selector: 'bottom-sheet',
  templateUrl: 'bottom-sheet.html',
})
export class BottomSheet {
  constructor(private _bottomSheetRef: MatBottomSheetRef<BottomSheet>, private router:Router) {}

  openLink(event: MouseEvent): void {
    this._bottomSheetRef.dismiss();
    event.preventDefault();
  }
  close(){
    this._bottomSheetRef.dismiss();
  }
  closeSign() {
    this._bottomSheetRef.dismiss();
    this.router.navigate(["/signup"])
  }
  closeLogin() {
    this._bottomSheetRef.dismiss();
    this.router.navigate(["/login"])
  }
}
