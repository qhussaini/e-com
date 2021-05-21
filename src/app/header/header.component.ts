import { Component, HostListener, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Address, Category } from '../admin/product.model';
import { ProductsService } from '../admin/products.service';
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
  category: Category[];
  public innerWidth: number;
  address:Address = {};
  isLoading = false;

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.innerWidth = window.innerWidth;
  }

  constructor(public theme:ThemeService, public productService:ProductsService, public authService: AuthService, public cart: ShoppingCartService, private route: Router) { }

  ngOnInit() {
    this.isLoading = true;
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authListenerSub = this.authService.getUserAuthStatus().subscribe(isAuthenticated => {
      this.userIsAuthenticated = isAuthenticated
    });
    this.innerWidth = window.innerWidth;
    this.route.events.subscribe((val) => {
      if (this.userIsAuthenticated) {
        // this.cart.address = JSON.parse(localStorage.getItem("address"));
        this.authService.getAddress().subscribe((data) => {
          this.cart.address = data
          this.address = this.cart.address[0];
        });
      }
    });
    this.productService.getCategory()
    this.productService.getUpdateCategory().subscribe(category => {
      this.category = category;
      this.isLoading = false;
    })
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

