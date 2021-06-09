import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { AuthData } from './auth-data.model';
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs/operators';
import { ShoppingCartService } from '../my-order/shopping-cart.service';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userAuth = false;
  private userName = "";
  private clientName = "";
  private token: string|undefined;
  private authStatusListener = new Subject<boolean>();
  private userNameUpdate = new Subject<string>();
  private clientNameUpdate = new Subject<string>();
  private tokenTimer: any;
  private userType: string="";
  public isSigning: boolean = false;
  user: AuthData;

constructor(private http: HttpClient, private router: Router, private toastr: ToastrService) { }

  getToken(){
    return this.token;
  }
  getIsAuth(){
    return this.userAuth;
  }
  getIsAuthAdmin(){
    if(this.userType==="wholesaler"){
      return this.userAuth;
    }else {
      return false
    }
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
  setAddress(addressArray){
    console.log(addressArray);
    return this.http.post<{address:any, message:string}>('http://localhost:3000/api/address/add', addressArray).pipe(map(user => {
      console.log(user.address)
      return user.address;
    }));
  }

  getAddress(){
    return this.http
      .get<{ message: string; address: any }>(
        'http://localhost:3000/api/address/get'
      ).pipe(map(adr => {
        return adr.address
      }))
  }
  deleteAddress(address) {
    return this.http.delete("http://localhost:3000/api/address/delete/"+address)
  }

  getClientData(id:string) {
    this.http
      .get<{ message: string; userName: string }>(
        'http://localhost:3000/api/user/client/' + id
      )
      .subscribe((appointmentData) => {
        this.clientName = appointmentData.userName;
        this.clientNameUpdate.next(this.clientName);
      });
  }

  getUserType(){
    return this.userType;
  }

  getUpdateUserName() {
    return this.userNameUpdate.asObservable();
  }
  getUpdateClientName() {
    return this.clientNameUpdate.asObservable();
  }

  // getUserNamed() {
  //   return this.http.get<{ message: string, userName: string }>('http://localhost:3000/api/user').subscribe(data => {
  //     console.log("username : " + data.userName)
  //     this.userName = data.userName;
  //   });
  // }

  createUser(loginID: string, userName: string, password: string, usertype: string, shopNumber:number, shopName:string) {
    const authData: AuthData = {email: loginID, userName: userName, passWord: password, userType: usertype, shopNumber:shopNumber, shopName:shopName}
    return this.http.post<{message:string, error:string}>('http://localhost:3000/api/user/signup', authData)
      .subscribe(response => {
        if (response.message == "User created!") {
          this.toastr.success("Your Account Is successfully created", "Signup Successful",{
            timeOut:1000,
            progressBar:true,
          })
          setTimeout(() => {
            const isloading = false;
            this.router.navigate(["/account/confirm"]);
          }, 1000);
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
    if (expiresIn > 0) {
      this.token = authInformation.token;
      this.userAuth = true;
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
      this.userType = localStorage.getItem("userType");
      this.userName = localStorage.getItem("userName");
    }
  }

  // login(emailId: string, password: string) {
  //   const authData: AuthData = {email: emailId, passWord: password}
  //   console.log("reached")
  //   return this.http.post<{token: string, expiresIn: number, userType:string, userName:string}>('http://localhost:3000/api/user/login', authData)
  //     .subscribe(response => {
  //       const token = response.token;
  //       this.token = token;
  //       if (this.token){
  //         const userType = response.userType;
  //         const userName = response.userName;
  //         const expiresInDuration = response.expiresIn;
  //         this.setAuthTimer(expiresInDuration);
  //         this.userAuth = true;
  //         this.authStatusListener.next(true);
  //         const now = new Date();
  //         const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
  //         console.log("token userType : " + this.userType);
  //         this.saveAuthData(token, expirationDate, userType, userName);
  //         this.router.navigate(['/']);
  //         this.getIsAuth()
  //         return this.token
  //       }
  //     });
  // }

  login_cb(email: string, password: string) {
    const authData: AuthData = {email: email, passWord: password}
    return this.http.post<any>('http://localhost:3000/api/user/login', authData)
      .pipe(map(user => {
        // login successful if there's a jwt token in the response
        if (user && user.token) {
          this.user = user;
          // store user details and jwt in cookie
          this.token = user.token
          if (this.token){
            const userType = user.userType;
            const userName = user.userName;
            const expiresInDuration = user.expiresIn;

            const address = user.address;
            this.setAuthTimer(expiresInDuration);
            this.userAuth = true;
            this.authStatusListener.next(true);
            const now = new Date();
            const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
            console.log("token userType : " + this.userType);
            console.log("token address : " + address);
            this.saveAuthData(this.token, expirationDate, userType, userName);
            this.router.navigate(['/']);
            this.getIsAuth()
            return userType
          }
        }
          return user;
      }));
  }
  checkAuth(password: string) {
    const authData = {passWord: password}
    return this.http.post<any>('http://localhost:3000/api/user/checkAuth', authData)
      .pipe(map(user => {
          return user;
      }));
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

  private saveAuthData (token: string, expirationDate: Date, userType: string, userName){
    localStorage.setItem("token", token);
    localStorage.setItem("userType", userType);
    localStorage.setItem("userName", userName);
    // localStorage.setItem("address", JSON.stringify(address));
    localStorage.setItem("expirationDate", expirationDate.toISOString());
    this.userType = localStorage.getItem("userType");
  }
  private clearAuthData() {
    localStorage.removeItem("token");
    localStorage.removeItem("expirationDate");
    localStorage.removeItem("userType");
    localStorage.removeItem("userName");
    localStorage.removeItem("address");
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
