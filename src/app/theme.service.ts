import { OverlayContainer } from '@angular/cdk/overlay';
import { Injectable } from '@angular/core';
import { AuthService } from './auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  themeDark = false;
  deviceXs: boolean;
  themeColor: string;
  sideBar:string;
  logo:string;
  isLoginOrSignup:boolean = false;
  isProductList: boolean = false;
  comName:string;
  changeButton: string = "dark_mode";

constructor(private overlay:OverlayContainer, private auth:AuthService) { }

  themeChange(){
    if(!this.themeDark){
      this.overlay.getContainerElement().classList.add('dark-mode');
      this.setThemeColor(true);
      this.changeButton = "light_mode";
    }else {
      this.overlay.getContainerElement().classList.remove('dark-mode');
      this.setThemeColor(false);
      this.changeButton = "dark_mode";
    }
  }
  getThemeChange(){
    if(this.themeDark){
      this.overlay.getContainerElement().classList.add('dark-mode');
      this.setThemeColor(true);
      this.changeButton = "light_mode";
    }else {
      this.overlay.getContainerElement().classList.remove('dark-mode');
      this.setThemeColor(false);
      this.changeButton = "dark_mode";
    }
  }
  private setThemeColor(theme:boolean){
    this.themeDark = theme;
    localStorage.setItem('user-theme', `${theme}`);
  }

  getThemeColor(){
    if (localStorage.getItem('user-theme') && localStorage.getItem('user-theme') === "true") {
      this.themeDark = true
    }else {
      this.themeDark = false;
    }
  }

}
