import { OverlayContainer } from '@angular/cdk/overlay';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  themeDark = false;

constructor(private overlay:OverlayContainer) { }

  themeChange(){
    if(this.themeDark){
      this.overlay.getContainerElement().classList.add('dark-mode');
    }else {
      this.overlay.getContainerElement().classList.remove('dark-mode');
    }
  }

}
