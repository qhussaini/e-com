import { Component, HostListener, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { ShoppingCartService } from '../my-order/shopping-cart.service';
import { ThemeService } from '../theme.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {

  @Input() deviceXs:boolean;

  userIsAuthenticated = false;
  private authListenerSub: Subscription;
  themeDark = false;
  cartCount: any=0;
  public innerWidth: number;

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.innerWidth = window.innerWidth;
  }

  constructor(public theme:ThemeService, public authService: AuthService, public cart: ShoppingCartService) { }

  ngOnInit() {
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authListenerSub = this.authService.getUserAuthStatus().subscribe(isAuthenticated => {
      this.userIsAuthenticated = isAuthenticated
    });
    this.innerWidth = window.innerWidth;
  }

  ngOnDestroy() {
    this.authListenerSub.unsubscribe();
  }

  onLogout(){
    this.authService.logout();
  }

  inCartCount(){
    if (this.cartCount > 8) {
      this.cartCount = 9+'+'
    }else if(this.cartCount !==9+'+'){
      this.cartCount = this.cartCount+1
    }
    console.log("value"+ this.cartCount)
  }
  themeSelecter(){
    if (this.theme.themeDark === true) {
      this.theme.themeDark = false;
    }else {
      this.theme.themeDark = true;
    }
  }

}

