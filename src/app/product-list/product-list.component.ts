import { DecimalPipe } from '@angular/common';
import { Component, Input, OnDestroy, OnInit, PipeTransform } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Category, Flavor, Product } from '../admin/product.model';
import { ProductsService } from '../admin/products.service';
import { AuthService } from '../auth/auth.service';
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
  products: Product[] = [];
  categorys: Category[];
  flavors: Flavor[];
  quantity:number;
  isLoading:boolean = false;
  isbtnLoading:boolean = false;
  valuForm: FormGroup
  products$: Observable<Product[]>;
  filter = new FormControl('');
  filteredProducts: Product[] = [];
  private _filterTerm: string;
  totalProducts = 10;
  productPerPage = 5;
  currentPage = 1;
  pageSizeOptions = [5,10,15,20];
  userIsAuthenticated: any;
  authListenerSub: Subscription;

  constructor(
    public theme:ThemeService,
    public cartService:ShoppingCartService,
    private activatedRoute: ActivatedRoute,
    public productService: ProductsService,
    private pipe: DecimalPipe,
    private auth: AuthService,
    private toastr: ToastrService,
    ){}


  getfilterTerm():string {
    return this._filterTerm;
  }
  setfilterTerm(value: string){
    this._filterTerm = value
    this.productService.filteredProducts = this.filterProducts(value);
  }

  filterProducts(searchString: string){
    return this.products.filter(product =>
      product.itemCategory.toLocaleLowerCase().indexOf(searchString.toLocaleLowerCase())!==-1);
  }
  async ngOnInit(){
    this.theme.isProductList = true;
    this.isLoading = true;
    this.productService.getProducts(this.productPerPage,this.currentPage);
    await this.activatedRoute.paramMap.subscribe(async (paramMap: ParamMap) => {
      this.productSub = await this.productService.getUpdateProduct().subscribe((productData: {product:Product[], productCount:number}) => {
        // this.isLoading = false;
        this.totalProducts = productData.productCount;
        this.productService.products = productData.product;
        if (paramMap.has("category")) {
          let category = paramMap.get("category")
          this.setfilterTerm(category);
          this.productService.filteredProducts = this.filterProducts(category);
        }else {
          this.productService.filteredProducts = this.productService.products;
        }
      });
    })
    this.userIsAuthenticated = this.auth.getIsAuth();
    this.authListenerSub = this.auth.getUserAuthStatus().subscribe(isAuthenticated => {
      this.userIsAuthenticated = isAuthenticated
    });
    // this.isLoading = true;
    this.productService.getCategory();
    this.productSub = this.productService.getUpdateCategory().subscribe((category: Category[]) => {
      // this.isLoading = false;
      this.categorys = category;
    });
    // this.isLoading = true;
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
    this.theme.isProductList = false;
    this.authListenerSub.unsubscribe();
  }

  onChangePage(pageData: PageEvent){
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.productPerPage = pageData.pageSize;
    this.productService.getProducts(this.productPerPage, this.currentPage);
    this.activatedRoute.paramMap.subscribe(async (paramMap: ParamMap) => {
      if (paramMap.has("category")) {
        let category = paramMap.get("category")
        this.productSub = this.productService.getUpdateProduct().subscribe((productData: {product:Product[], productCount:number}) => {
          this.totalProducts = productData.productCount;
          this.productService.products = productData.product;
          this.productService.filteredProducts = this.productService.products;
          this.productService.filteredProducts = this.filterProducts(category);
        });
        console.log("cat " + category);
        // await this.setfilterTerm(category);
        this.isLoading = false;
      }
    })
  }

  // addToCart(product: Product){
  //   this.cartService.addToCart(product);
  // }


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

  addToCart(option:Product) {
    this.isbtnLoading = true;
    if (this.userIsAuthenticated) {
      console.log(true)
      this.cartService.getCartId().subscribe((data) => {
        if (data.cart) {
          this.cartMethod(option,data.cart._id)
          console.log(data.cart);
          console.log(data.message);
          console.log(data.cart._id);
          this.cartService.updateCart(data.cart._id).subscribe((updatedData) => {
            console.log(updatedData.cart);
          })
          this.isbtnLoading = false;
          // this.cartService.cartShow = data.cart;
        } else {
          this.cartService.createNewCart().subscribe((newData) => {
            this.cartMethod(option,newData.cart._id);
            this.cartService.updateCart(newData.cart._id).subscribe((updatedData) => {
            console.log(updatedData.cart);
          })
            console.log(newData.cart._id);
            this.isbtnLoading = false;
          })
        }
      })
    } else {
      this.cartMethod(option)
    }
    // localStorage.setItem("cartItem", JSON.stringify(this.cartService.cartShow))
  }

  cartMethod(option:Product,cartId?:string){
    console.log(option.itemId)
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
        totalPrice: quantity * itemMRP,
        cartId: cartId
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
        totalPrice: quantity * itemMRP,
        cartId: cartId
      });
    }
    console.log(this.cartService.cartShow);
  }

}
