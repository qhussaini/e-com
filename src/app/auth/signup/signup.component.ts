import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit, OnDestroy {

  isLoading:boolean=false;
  userType: string = ' ';

  constructor(public authService: AuthService) { }

  ngOnInit() {
    this.authService.isSigning = true;
  }

  ngOnDestroy() {
    this.authService.isSigning = false;
  }

  typeSelect( form: NgForm, type: string ){
    const usertype = type;
    this.userType = usertype;
  }

  onSignup(form:NgForm){
    // console.log("ggsj : "+ form.value)
    if ( form.invalid ){
      return;
    }
    this.isLoading = true;
    this.authService.createUser(form.value.eId,form.value.userName, form.value.passDoc, form.value.usertype, form.value.shopName, form.value.shopNumber );

  }

}
