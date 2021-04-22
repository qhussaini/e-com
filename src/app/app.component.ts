import { OverlayContainer } from '@angular/cdk/overlay';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatBottomSheet, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from './auth/auth.service';
import { ThemeService } from './theme.service';
import { MediaObserver, MediaChange } from '@angular/flex-layout';
import { Subscription } from 'rxjs';
import { ShoppingCartService } from './my-order/shopping-cart.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy{
  title = 'ecom-ice';
  mediaSub: Subscription;
  constructor(
    public theme:ThemeService,
    private _bottomSheet: MatBottomSheet,
    private auth: AuthService,
    private overlay:OverlayContainer,
    public mediaObserver: MediaObserver,
    private cart: ShoppingCartService
    ) {}

  ngOnInit(){
    this.mediaSub = this.mediaObserver.media$.subscribe((result: MediaChange) => {
      this.theme.deviceXs = result.mqAlias === 'xs' ? true : false;
      if(this.theme.deviceXs) {
        this.theme.sideBar = "over"
      }else {
        this.theme.sideBar = "side"
      }
    })
    this.theme.getThemeColor();
    this.theme.themeChange()
    this.cart.cartShow = JSON.parse(localStorage.getItem("cartItem") || "[]");
    setTimeout(()=>{
      var isLogedin = null
      isLogedin = localStorage.getItem('token');
      if (isLogedin===null && !this.auth.isSigning) {
        this._bottomSheet.open(BottomSheet);
      }
    },60000*5)
    this.auth.autoAuthUser();
  }
  ngOnDestroy(){
    this.mediaSub.unsubscribe();
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
