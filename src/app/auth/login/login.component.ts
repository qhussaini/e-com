import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';
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
  submitted = false;
  returnUrl: string;
  error = "";
  showPass:boolean = false;
  passtype:string = "password";

  constructor(private router:Router, private route: ActivatedRoute, private auth: AuthService, public theme:ThemeService) { }

  ngOnInit() {
    this.auth.isSigning = true;
    this.returnUrl = this.route.snapshot.queryParams["returnUrl"] || "/products"
    console.log(this.returnUrl)
    console.log(this.route.snapshot)
  }
  ngOnDestroy() {
    this.auth.isSigning = false;
  }

  // onLogin(form: NgForm){
  //   if(form.invalid) {
  //     console.log("error")
  //     return;
  //   }
  //   console.log("542aas")
  //   this.isLoading = true;
  //   this.auth.login(form.value.eId, form.value.passDoc );
  // }
  showpass(){
    if(this.showPass){
      this.passtype = "text"
    }else {
      this.passtype = "password"
    }
  }

  onLogin(form: NgForm) {
    this.submitted = true;

    // stop here if form is invalid
    if (form.invalid) {
      return;
    }
    this.username = form.value.eId;
    this.isLoading = true;
    this.auth
      .login_cb(this.username.toLowerCase(), form.value.password)
      .pipe(first())
      .subscribe(
        (data) => {
          this.router.navigate([this.returnUrl]);
          this.isLoading = false;
        },
        (error) => {
          console.log(error.error)
          this.error = error.error.message;
          this.isLoading = false;
        }
      );
  }

  // login() : void {
  //   if(this.username == 'admin' && this.password == 'admin'){
  //    this.router.navigate(["user"]);
  //   }else {
  //     alert("Invalid credentials");
  //   }
  // }

}
