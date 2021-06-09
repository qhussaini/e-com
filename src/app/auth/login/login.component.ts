import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { Product } from 'src/app/admin/product.model';
import { ProductsService } from 'src/app/admin/products.service';
import { ShoppingCartService } from 'src/app/my-order/shopping-cart.service';
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

  constructor(private router:Router,private cart:ShoppingCartService, private productService:ProductsService, private route: ActivatedRoute, private auth: AuthService, public theme:ThemeService) { }

  ngOnInit() {
    this.auth.isSigning = true;
    this.returnUrl = this.route.snapshot.queryParams["returnUrl"] || "/products"
    this.theme.isLoginOrSignup = true;
  }
  ngOnDestroy() {
    this.auth.isSigning = false;
    this.theme.isLoginOrSignup = false;
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
          console.log(data)
          if (data === "wholesaler") {
            this.router.navigate(["/admin/dash"]);
          }else {
            this.router.navigate([this.returnUrl]);
            this.setCart();
          }
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
  setCart(){
    this.cart.getCartId().subscribe((cartData) => {
      if (cartData.cart) {
        cartData.cart.product.productId.forEach(async cartItem => {
          console.log(cartItem.itemId);
          let products:Product[]=[];
          this.cart.cartShow = []
          if(cartItem.itemId){
            await this.productService.getProduct(cartItem.itemId).subscribe((productData) => {
              this.cart.cartShow.push({
                product:{
                  itemId: productData._id,
                  itemName: productData.itemName,
                  itemMRP: productData.itemMRP,
                  itemCategory: productData.itemCategory,
                  itemFlavors: productData.itemFlavors,
                  itemImage: productData.itemImgUrl,
                },
                productQty:cartItem.productQty,
                totalPrice:cartItem.productQty*productData.itemMRP,
                cartId:cartData.cart._id
              })
            })
          } else {
            alert('internal error')
          }
          console.log(this.cart.cartShow);
        })
      }
    })
  }

}
