import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { ThemeService } from '../theme.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {

  userIsAuthenticated = false;
  private authListenerSub: Subscription;
  themeDark = false;
  cartCount: any=0;

  constructor(public theme:ThemeService, private authService: AuthService) { }

  ngOnInit() {
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authListenerSub = this.authService.getUserAuthStatus().subscribe(isAuthenticated => {
      this.userIsAuthenticated = isAuthenticated
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

