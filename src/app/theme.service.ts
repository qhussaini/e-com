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
    }else {
      this.overlay.getContainerElement().classList.remove('dark-mode');
    }
  }
  setThemeColor(theme){
    this.themeColor = theme;
    localStorage.setItem('user-theme', theme);
  }

  getThemeColor(){
    if (localStorage.getItem('user-theme')) {
      this.themeColor = localStorage.getItem('user-theme')
    }else {
      this.themeColor = 'light-mode';
    }
  }

}
