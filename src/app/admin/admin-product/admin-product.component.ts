import { DecimalPipe } from '@angular/common';
import { Component, OnInit, PipeTransform } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { first, map, startWith } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/auth.service';
import Swal from 'sweetalert2';
import { Product } from '../product.model';
import { ProductsService } from '../products.service';

@Component({
  selector: 'app-admin-product',
  templateUrl: './admin-product.component.html',
  styleUrls: ['./admin-product.component.scss'],
  providers: [DecimalPipe]
})
export class AdminProductComponent implements OnInit {

  products$: Observable<Product[]>;
  products: Product[];
  filter = new FormControl('');
  isLoading:boolean = false;
  totalProduct = 0;
  productPerPage: number=5;
  currentPage: number=1;

  constructor(public productsData: ProductsService, private pipe: DecimalPipe, private auth:AuthService, private toastr: ToastrService) {}
  search(text: string, pipe: PipeTransform): Product[] {
    return this.products.filter(product => {
      const term = text.toLowerCase();
      return product.itemName.toLowerCase().includes(term)
          || pipe.transform(product.itemMRP).includes(term);
    });
  }

  ngOnInit() {
    this.isLoading = true;
    this.productsData.getProducts(5,1);
    this.productsData.getUpdateProduct().subscribe((productData: {product:Product[], productCount:number}) => {
      this.isLoading = false;
      this.totalProduct = productData.productCount;
      this.products = productData.product;
    });
    this.products$ = this.filter.valueChanges.pipe(
      startWith(''),
      map(text => this.search(text, this.pipe))
    );
  }

  onEdit(id:string){
    this.productsData.getProduct(id);
  }

  onDelete(itemId: string) {
    Swal.fire({
      title: 'Warning',
      text: "Are you sure you want to permanently delete this product",
      icon: 'warning',
      confirmButtonText: 'Yes, Delete',
      cancelButtonText: 'No, keep it',
      showCancelButton:true,
      allowEscapeKey:false,
      allowOutsideClick:false,
    }).then((result) => {
      if (result.value) {
        Swal.fire({
          title: 'Enter your Admin Password',
          input: 'password',
          inputLabel: 'Your Admin Password',
          // inputValue: inputValue,
          showCancelButton: true,
          inputValidator: (value) => {
            if (!value) {
              return 'You need to enter password'
            }else{
              this.auth
                .checkAuth(value)
                .pipe(first())
                .subscribe(
                  (data) => {
                    console.log(data)
                    if (data.message === "auth Successful"){
                      this.isLoading = true;
                      this.productsData.deleteProduct(itemId).subscribe(() =>{
                        this.productsData.getProducts(this.productPerPage,this.currentPage);
                      });
                    }
                  },
                  (error) => {
                    if (error.error.message==="Unauthorised Check your password"){
                      this.toastr.error("check your password", "Invalid password",{
                        timeOut:3000,
                        progressBar:true,
                      })
                    }
                  }
                );
            }
          }
        })

      } else if (result.isDismissed) {
        // this.router.navigate(['/']);
      }
    })
  }

  passConfirm(){
    Swal.fire({
      title: 'Enter your Admin Password',
      input: 'password',
      inputLabel: 'Your Admin Password',
      // inputValue: inputValue,
      showCancelButton: true,
      inputValidator: (value) => {
        if (!value) {
          return 'You need to enter password'
        }
      }
    })
  }


}
