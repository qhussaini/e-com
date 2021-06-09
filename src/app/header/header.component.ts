import { Component, HostListener, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OverlayContainer } from 'ngx-toastr';
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
  address:Address={};
  isAddress:boolean = false;
  isLoading = false;
  private _filterTerm: string;
  changeButton: string = "dark_mode";

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.innerWidth = window.innerWidth;
  }

  constructor(private overlay:OverlayContainer, public theme:ThemeService, public productService:ProductsService, public authService: AuthService, public cart: ShoppingCartService, private route: Router) { }

  getfilterTerm():string {
    return this._filterTerm;
  }
  setfilterTerm(value){
    this._filterTerm = value
    this.productService.filteredProducts = this.filterProducts(value);
  }

  filterProducts(searchString: string){
    return this.productService.products.filter(product =>
      product.itemName.toLocaleLowerCase().indexOf(searchString.toLocaleLowerCase())!==-1);
  }

  ngOnInit() {
    this.isLoading = true;
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authListenerSub = this.authService.getUserAuthStatus().subscribe(isAuthenticated => {
      this.userIsAuthenticated = isAuthenticated
    });
    this.productService.getCategory()
    this.productService.getUpdateCategory().subscribe(category => {
      this.category = category;
      this.isLoading = false;
    })
    this.innerWidth = window.innerWidth;
    this.route.events.subscribe((val) => {
      if (this.authService.getIsAuth()) {
        // this.cart.address = JSON.parse(localStorage.getItem("address"));
        this.authService.getAddress().subscribe((data) => {
          this.cart.address = data
          if (this.cart.address.length>0) {
            this.isAddress = true
            this.address = this.cart.address[0];
          }
        });
        this.theme.getThemeColor();
      }
    });
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

