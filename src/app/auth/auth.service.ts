import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { AuthData } from './auth-data.model';
import { ToastrService } from 'ngx-toastr';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userAuth = false;
  private userName = "";
  private token: string|undefined;
  private authStatusListener = new Subject<boolean>();
  private userNameUpdate = new Subject<string>();
  private tokenTimer: any;
  public isSigning: boolean = false;

constructor(private http: HttpClient, private router: Router, private toastr: ToastrService) { }

  getToken(){
    return this.token;
  }
  getIsAuth(){
    return this.userAuth;
  }
  getUserName(){
    return this.userName;
  }

  getUserAuthStatus(){
    return this.authStatusListener.asObservable();
  }
  // getUserName(){
  //   return this.userName;
  // }

  // getUserData(){
  //   return this.http.get<{ userName: string }>('http://localhost:3000/api/user' ).subscribe(data => {
  //     this.userName = data.userName
  //   })
  // }
  getUserData() {
    this.http
      .get<{ message: string; userName: string }>(
        'http://localhost:3000/api/user'
      )
      .subscribe((appointmentData) => {
        this.userName = appointmentData.userName;
        this.userNameUpdate.next(this.userName);
      });
  }

  getUpdateUserName() {
    return this.userNameUpdate.asObservable();
  }

  // getUserNamed() {
  //   return this.http.get<{ message: string, userName: string }>('http://localhost:3000/api/user').subscribe(data => {
  //     console.log("username : " + data.userName)
  //     this.userName = data.userName;
  //   });
  // }

  createUser(loginID: string, userName: string, password: string, usertype: string, shopNumber:number, shopName:string) {
    const authData: AuthData = {email: loginID, userName: userName, passWord: password, userType: usertype, shopNumber:shopNumber, shopName:shopName}
    this.http.post<{message:string, error:string}>('http://localhost:3000/api/user/signup', authData)
      .subscribe(response => {
        if (response.message == "User created!") {
          this.toastr.success("Your Account Is successfully created", "Signup Successful",{
            timeOut:1000,
            progressBar:true,
          })
        }else{
          this.toastr.error("Your Signup Failed", "Signup Failed",{
            timeOut:1000,
            progressBar:true,
          })
        }
        console.log(response.error);
      });
  }

  autoAuthUser(){
    const authInformation = this.getAuthData();
    if(!authInformation){
      return;
    }
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    console.log("sdkfjs : "+expiresIn);
    if (expiresIn > 0) {
      this.token = authInformation.token;
      this.userAuth = true;
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
    }
  }

  login(emailId: string, password: string) {
    const authData: AuthData = {email: emailId, passWord: password, userType:""}
    console.log("reached")
    this.http.post<{token: string, expiresIn: number}>('http://localhost:3000/api/user/login', authData)
      .subscribe(response => {
        const token = response.token;
        this.token = token;
        if (this.token){
          const expiresInDuration = response.expiresIn;
          this.setAuthTimer(expiresInDuration);
          this.userAuth = true;
          this.authStatusListener.next(true);
          const now = new Date();
          const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
          console.log("token time : " + expirationDate);
          this.saveAuthData(token, expirationDate);
          this.router.navigate(['/']);
          this.getIsAuth()
        }
      });
  }

  logout(){
    this.token = undefined;
    this.userAuth = false;
    this.authStatusListener.next(false);
    this.router.navigate(['/']);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
  }

  private setAuthTimer(duration: number) {
    console.log("Starting time : " + duration);
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  private saveAuthData (token: string, expirationDate: Date){
    localStorage.setItem("token", token);
    localStorage.setItem("expirationDate", expirationDate.toISOString());
  }
  private clearAuthData() {
    localStorage.removeItem("token");
    localStorage.removeItem("expirationDate");
  }
  private getAuthData() {
    const token = localStorage.getItem("token");
    const expirationDate = localStorage.getItem("expirationDate");
    if (!token || !expirationDate) {
      return;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate)
    }
  }

}
