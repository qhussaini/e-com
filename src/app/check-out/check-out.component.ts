// import { Observable } from 'rxjs/Observable';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { Address } from '../admin/product.model';
import { AuthService } from '../auth/auth.service';
import { ShoppingCartService } from '../my-order/shopping-cart.service';
import { ShoppingCart } from '../shopping-cart/shopping-cart';
import { ThemeService } from '../theme.service';

@Component({
  selector: 'app-check-out',
  templateUrl: './check-out.component.html',
  styleUrls: ['./check-out.component.scss']
})
export class CheckOutComponent implements OnInit{
  shipping;
  cartItem = [];
  totalPrice:number=0;
  isLoading=false;
  addressform: FormGroup;
  selected:number;
  selectedAddress:Address;
  addressSelected:boolean = false;
  addingAdreess:boolean = true;


  cart$: Observable<ShoppingCart>;

  constructor(public cart: ShoppingCartService, public theme: ThemeService,  private toastr: ToastrService, private authService:AuthService, private route: Router, private activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.isLoading = true;
    this.cart.cartShow.forEach((value) => {
      this.totalPrice += value.totalPrice
      let itemId = value.product.itemId
      let productQty = value.productQty
      this.cartItem.push({itemId:itemId, productQty: productQty})
      console.log(this.cartItem)
      // this.productQty.push(value.productQty)
      this.isLoading = false;
    });

  }

  getSelectedAddress(address){
    this.selectedAddress = address;
  }

  selectaddress(){
    if (this.addressSelected) {
      this.addressSelected = false;
    } else {
      this.addressSelected = true;
    }
  }

  setAddress(form){
    let address = {
      name: form.value.name,
      addressLine1: form.value.addressLine1,
      addressLine2: form.value.addressLine2,
      city: form.value.city,
      pincode: form.value.pincode,
      phone: form.value.phone,
      country: form.value.country,
    }
    this.authService.setAddress(address).subscribe((data) => {
      console.log(data)
    })
  }

  deleteAddress(address){
    this.isLoading = true;
    console.log(address._id);
    this.authService.deleteAddress(address._id).subscribe((data) =>{
      console.log(data);
      this.authService.getAddress().subscribe((newData) => {
        this.cart.address = newData
        this.isLoading = false;
      });
    })
  }

  addToCart() {
    if (this.selectedAddress) {
      let address = {
        name: this.selectedAddress.name,
        addressLine1: this.selectedAddress.addressLine1,
        addressLine2: this.selectedAddress.addressLine2,
        city: this.selectedAddress.city,
        country: this.selectedAddress.country,
        pincode: this.selectedAddress.pincode,
        phone: this.selectedAddress.phone
      }
      this.cart.createNewOrder(this.cartItem, this.totalPrice, address)
      .subscribe(result => {
        this.toastr.success("Order Placed successfully", "",{
          timeOut:3000,
          progressBar:true,
        })
        this.route.navigate(["/order-placed/"+result.cart._id])
        this.cart.cartShow = [];
        localStorage.removeItem("cartItem")
      });
    }else{
      this.toastr.error("please select shipping address", "Address",{
        timeOut:5000,
        progressBar:true,
      })
    }
  }
}
