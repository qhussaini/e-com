import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ThemeService } from 'src/app/theme.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit, OnDestroy {

  isLoading:boolean=false;
  userType: string = ' ';
  verifyPassword:string="";
  machPasword:boolean;
  submit: boolean;

  constructor(public authService: AuthService, public theme:ThemeService) { }

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
  verify(pass:string){
    if(this.verifyPassword === pass) {
      this.machPasword = false;
    }else {
      this.machPasword = true;
    }
  }

  onSignup(form:NgForm){
    // console.log("ggsj : "+ form.value)
    this.submit = true;
    if ( form.invalid && !this.machPasword || !this.machPasword ){
      return;
    }
    this.isLoading = true;
    this.authService.createUser(form.value.eId,form.value.userName, form.value.passDoc, form.value.usertype, form.value.shopName, form.value.shopNumber );

  }

}
