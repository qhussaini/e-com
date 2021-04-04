import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ThemeService } from 'src/app/theme.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

  username: string;
  password: string;
  isLoading: boolean = false;

  constructor(private router:Router, private auth: AuthService, public theme:ThemeService) { }

  ngOnInit() {
    this.auth.isSigning = true;
  }
  ngOnDestroy() {
    this.auth.isSigning = false;
  }

  onLogin(form: NgForm){
    if(form.invalid) {
      console.log("error")
      return;
    }
    console.log("542aas")
    this.auth.login(form.value.eId, form.value.passDoc );
  }

  // login() : void {
  //   if(this.username == 'admin' && this.password == 'admin'){
  //    this.router.navigate(["user"]);
  //   }else {
  //     alert("Invalid credentials");
  //   }
  // }

}
