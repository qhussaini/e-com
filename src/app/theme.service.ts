import { OverlayContainer } from '@angular/cdk/overlay';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  themeDark = false;
  deviceXs: boolean;
  themeColor: string;
  sideBar:string;
constructor(private overlay:OverlayContainer) { }

  themeChange(){
    if(this.themeDark){
      this.overlay.getContainerElement().classList.add('dark-mode');
      this.setThemeColor(true);
    }else {
      this.overlay.getContainerElement().classList.remove('dark-mode');
      this.setThemeColor(false);
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
