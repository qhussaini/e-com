import { DecimalPipe } from '@angular/common';
import { Component, OnInit, PipeTransform } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
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

  constructor(public productsData: ProductsService, private pipe: DecimalPipe) {}
  search(text: string, pipe: PipeTransform): Product[] {
    return this.products.filter(product => {
      const term = text.toLowerCase();
      return product.itemName.toLowerCase().includes(term)
          || pipe.transform(product.itemMRP).includes(term);
    });
  }

  ngOnInit() {
    // this.products = [
    //   {itemName: "1/2 LITER-ALFANSO MANGO", itemImage:"https://pngimg.com/uploads/mango/mango_PNG9163.png", itemFlavors: "Mango", itemCategory:"Bars", itemMRP: 165},
    //   {itemName: "1/2 LITER-ANJEER BADAM", itemImage:"https://freepngimg.com/thumb/almond/5-2-almond-png-picture-thumb.png", itemFlavors: "Badam", itemCategory:"Bars", itemMRP: 165},
    //   {itemName: "1/2 LITER-APRICOT", itemImage:"http://pngimg.com/uploads/apricot/apricot_PNG12647.png", itemFlavors: "Apricot", itemCategory:"Bars", itemMRP: 0},
    //   {itemName: "1/2 LITER-BELGIUM DARK CHOCOLATE", itemImage:"https://www.pngarts.com/files/3/Dark-Chocolate-PNG-Picture.png", itemFlavors: "Chocolate", itemCategory:"Bars", itemMRP: 165},
    //   {itemName: "1/2 LITER-BERRY BONANZA", itemImage:"https://webstockreview.net/images/berries-clipart-single-6.png", itemFlavors: "Berry", itemCategory:"Bars", itemMRP: 0},
    //   {itemName: "1/2 LITER-BLACK CURRENT", itemImage:"https://lh3.googleusercontent.com/proxy/gGq1FTz0UGmqGggTxCa-e3QtgGjONMh6OAzarnQeQrpvL6rPRzkcGcBdN6szsQGV_gcm49DAmORk8YR5wWRXvFRqFMaan8I40z7vqkE_E4A9_IN_G3LMGatPa2c_DCzAwf5D", itemFlavors: "Current", itemCategory:"Bars", itemMRP: 0},
    //   {itemName: "1/2 LITER-BUTTER SCOTCH", itemImage:"https://i2.wp.com/srimadhuramcatering.com/wp-content/uploads/2020/08/butter-scotch-scoop.png?fit=600%2C600&ssl=1", itemFlavors: "Butter Scotch", itemCategory:"Bars", itemMRP: 115},
    // ];
    this.isLoading = true;
    this.productsData.getProducts();
    this.productsData.getUpdateProduct().subscribe((product: Product[]) => {
      this.isLoading = false;
      this.products = product;
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
            }else if (value==="12345"){
              this.isLoading = true;
              this.productsData.deleteProduct(itemId);
              this.productsData.getProducts();
              this.productsData.getUpdateProduct().subscribe((product: Product[]) => {
                this.isLoading = false;
                this.products = product;
              });
            }else {
              return 'Invalid password'
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
