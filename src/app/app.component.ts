import { Component, OnInit } from '@angular/core';
import { MatBottomSheet, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from './auth/auth.service';
import { ThemeService } from './theme.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'ecom-ice';
  constructor(public theme:ThemeService,  private _bottomSheet: MatBottomSheet, private auth: AuthService) {}

  ngOnInit(){
    setTimeout(()=>{
      var isLogedin = null
      isLogedin = localStorage.getItem('token');
      if (isLogedin===null && !this.auth.isSigning) {
        this._bottomSheet.open(BottomSheet);
      }
    },5000*7)
    this.auth.autoAuthUser();
  }

}


@Component({
  selector: 'bottom-sheet',
  templateUrl: 'bottom-sheet.html',
})
export class BottomSheet {
  constructor(private _bottomSheetRef: MatBottomSheetRef<BottomSheet>) {}

  openLink(event: MouseEvent): void {
    this._bottomSheetRef.dismiss();
    event.preventDefault();
  }
  close(){
    this._bottomSheetRef.dismiss();
  }
}
