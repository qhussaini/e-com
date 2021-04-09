import { DecimalPipe } from '@angular/common';
import { Component, Input, OnDestroy, OnInit, PipeTransform } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { Observable, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Category, Flavor, Product } from '../admin/product.model';
import { ProductsService } from '../admin/products.service';
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
  constructor(public theme:ThemeService, private productService: ProductsService, private pipe: DecimalPipe){}


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
}
