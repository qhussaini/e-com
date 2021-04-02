import { DecimalPipe } from '@angular/common';
import { Component, OnInit, PipeTransform } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, pipe } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Product } from '../product.model';
import { ProductsService } from '../products.service';

@Component({
  selector: 'app-admin-product',
  templateUrl: './admin-product.component.html',
  styleUrls: ['./admin-product.component.scss'],
  providers: [DecimalPipe]
})
export class AdminProductComponent implements OnInit {

  pruducts$: Observable<Product[]>;
  filter = new FormControl('');

  constructor(public productsData: ProductsService, private pipe: DecimalPipe) {}
  search(text: string, pipe: PipeTransform): Product[] {
    return this.productsData.products.filter(product => {
      const term = text.toLowerCase();
      return product.itemName.toLowerCase().includes(term)
          || pipe.transform(product.itemMRP).includes(term);
    });
  }

  ngOnInit() {
    this.pruducts$ = this.filter.valueChanges.pipe(
      startWith(''),
      map(text => this.search(text, this.pipe))
    );
  }
}
