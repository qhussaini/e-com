import { DecimalPipe } from '@angular/common';
import { Component, Input, OnDestroy, OnInit, PipeTransform } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { Observable, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Category, Flavor, Product } from '../admin/product.model';
import { ProductsService } from '../admin/products.service';
import { ShoppingCartService } from '../my-order/shopping-cart.service';
import { ThemeService } from '../theme.service';

export interface Section {
  name: string;
  updated: Date;
}

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
  providers: [DecimalPipe]
})
export class ProductListComponent implements OnInit, OnDestroy {

  topVal = 0;
  productSub:Subscription;
  products: Product[];
  categorys: Category[];
  flavors: Flavor[];
  quantity:number;
  isLoading:boolean = false;
  valuForm: FormGroup
  products$: Observable<Product[]>;
  filter = new FormControl('');
  totalProducts = 10;
  productPerPage = 2;
  currentPage = 1;
  pageSizeOptions = [5,10,15,20]
  folders: Section[] = [
    {
      name: 'Photos',
      updated: new Date('1/1/16'),
    },
    {
      name: 'Recipes',
      updated: new Date('1/17/16'),
    },
    {
      name: 'Work',
      updated: new Date('1/28/16'),
    }
  ];
  notes: Section[] = [
    {
      name: 'Vacation Itinerary',
      updated: new Date('2/20/16'),
    },
    {
      name: 'Kitchen Remodel',
      updated: new Date('1/18/16'),
    }
  ];
  formatLabel(value: number) {
    if (value >= 1000) {
      return Math.round(value / 1000) + 'k';
    }

    return value;
  }
  constructor(public theme:ThemeService, private cartService:ShoppingCartService, private productService: ProductsService, private pipe: DecimalPipe){}


  ngOnInit(){
    this.products$ = this.filter.valueChanges.pipe(
      startWith(''),
      map(text => this.search(text, this.pipe))
    );
    this.isLoading = true;
    this.productService.getProducts(this.productPerPage,this.currentPage);
    this.productService.getUpdateProduct().subscribe((productData: {product:Product[], productCount:number}) => {
      this.isLoading = false;
      this.totalProducts = productData.productCount;
      this.products = productData.product;
    });
    this.isLoading = true;
    this.productService.getCategory();
    this.productSub = this.productService.getUpdateCategory().subscribe((category: Category[]) => {
      this.isLoading = false;
      this.categorys = category;
    });
    this.isLoading = true;
    this.productService.getFlavor();
    this.productSub = this.productService.getUpdateFlavor().subscribe((flavor: Flavor[]) => {
      this.isLoading = false;
      this.flavors = flavor;
    });
    this.valuForm = new FormGroup({
      minValue: new FormControl(null, {
        validators: [Validators.required],
      }),
      maxValue: new FormControl(null, {
        validators: [Validators.required],
      }),
    })
  }
  ngOnDestroy(){
    this.productSub.unsubscribe();
  }

  onChangePage(pageData: PageEvent){
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.productPerPage = pageData.pageSize;
    this.productService.getProducts(this.productPerPage, this.currentPage);
  }

  // addToCart(product: Product){
  //   this.cartService.addToCart(product);
  // }

  search(text: string, pipe: PipeTransform): Product[] {
    return this.products.filter(product => {
      const term = text.toLowerCase();
      return product.itemName.toLowerCase().includes(term)
          || product.itemFlavors.toLowerCase().includes(term)
          ||product.itemCategory.toLowerCase().includes(term);
    });
  }


  onPriceSet() {
    if(this.valuForm.invalid){
      alert("Enter min price & max Price");
      return
    }
    console.table(this.valuForm);
  }
  getProductQuantity(product: Product){
    return this.cartService.cartShow.forEach(item => {
      if(product.itemName === item.product.itemName){
        return item.productQty;
      }
      return 0;
    })
    // return this.quantity ? this.quantity: 0;
  }

  addToCart(option) {
    const itemId = option.itemId;
    const itemName = option.itemName;
    const itemMRP: number = option.itemMRP;
    const itemCategory = option.itemCategory;
    const itemFlavors = option.itemFlavors;
    const ItemImage = option.itemImage;
    const quantity: number = 1;
    let dup = false;
    let qtyM = this.products.indexOf(option);
    this.cartService.cartShow.forEach((value) => {
      let product = value.product;
      if (product.itemName === itemName) {
        value.productQty++;
        let tp:number = value.product.itemMRP;
        value.totalPrice = tp * value.productQty;
        console.log(value.totalPrice);
        dup = true;
        // this.products[qtyM].IUnit =
        //   this.products[qtyM].IUnit - 1;
        // this.showToastr(itemName + " is added successfully");
      }
    });
      if (!dup && this.cartService.cartShow.length !== 0) {
        this.cartService.cartShow.push({
          product: {
            itemId: itemId,
            itemName: itemName,
            itemMRP: itemMRP,
            itemCategory: itemCategory,
            itemFlavors: itemFlavors,
            itemImage: ItemImage,
          },
          productQty: quantity,
          totalPrice: quantity * itemMRP
        });
      }
      if (this.cartService.cartShow.length === 0) {
        this.cartService.cartShow.push({
          product: {
            itemId: itemId,
            itemName: itemName,
            itemMRP: itemMRP,
            itemCategory: itemCategory,
            itemFlavors: itemFlavors,
            itemImage: ItemImage,
          },
          productQty: quantity,
          totalPrice: quantity * itemMRP
        });
        // console.log("main adding mothed is called");
        // console.log("bill di" + this.orderService.bill.length);
      }
      localStorage.setItem("cartItem", JSON.stringify(this.cartService.cartShow))
      console.log(this.cartService.cartShow)
  }

}
