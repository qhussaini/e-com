import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Category, Flavor, Product } from './product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductsService implements OnInit {

  public products: Product[] = [];
  private productsUpdate = new Subject<{product: Product[], productCount: number }>();
  public categorys: Category[];
  private categorysUpdate = new Subject<Category[]>();
  public flavors: Flavor[];
  private flavorsUpdate = new Subject<Flavor[]>();


constructor(private http: HttpClient, private router: Router, private toastr: ToastrService) { }

  ngOnInit(){
  }

  getProducts(productsPerPage:number, currentPage:number) {
    const queryParams = `?pagesize=${productsPerPage}&page=${currentPage}`;
    this.http
      .get<{ message: string; products: any, maxProducts: number }>("http://localhost:3000/api/admin/products" + queryParams)
      .pipe(
        map((productData) => {
          return {products: productData.products.map((product) => {
            return {
              itemId:product._id,
              itemName: product.itemName,
              itemCategory: product.itemCategory,
              itemMRP: product.itemMRP,
              itemImage: product.itemImgUrl,
              itemFlavors: product.itemFlavors,
              creator: product.creator
            };

          }),
          maxProduct: productData.maxProducts
        };
        })
      )
      .subscribe((transformProductData) => {
        this.products = transformProductData.products;
        this.productsUpdate.next({product:[...this.products], productCount: transformProductData.maxProduct});
      });
  }
  getCategory() {
    this.http
      .get<{ message: string; category: any }>("http://localhost:3000/api/admin/products/categorys")
      .pipe(
        map((productData) => {
          return productData.category.map((categorys) => {
            if(categorys.category){
              return {
                newCategory: categorys.category,
                categoryId: categorys._id,
                categoryImage: categorys.categoryImage,
              };
            }else {
              return {
                newCategory: null
            };
            }
          });
        })
      )
      .subscribe((transformPosts) => {
        this.categorys = transformPosts;
        this.categorysUpdate.next([...this.categorys]);
      });
  }
  getFlavor() {
    this.http
      .get<{ message: string; flavor: any }>("http://localhost:3000/api/admin/products/flavors")
      .pipe(
        map((productData) => {
          return productData.flavor.map((flavors) => {
            if(flavors.flavor){
              return {
                  newFlavors: flavors.flavor,
                  flavorId: flavors._id
              };
            }else {
              return {
                newFlavors: null
            };
            }
          });
        })
      )
      .subscribe((transformPosts) => {
        this.flavors = transformPosts;
        this.flavorsUpdate.next([...this.flavors]);
      });
  }

  getProduct(id: string) {
    return this.http.get<{
      _id: string;
      itemName: string;
      itemCategory: string;
      itemMRP: number;
      itemImgUrl:string;
      itemFlavors: string;
    }>("http://localhost:3000/api/admin/products/" + id);
  }

  getUpdateCategory() {
    return this.categorysUpdate.asObservable();
  }
  getUpdateFlavor() {
    return this.flavorsUpdate.asObservable();
  }
  getUpdateProduct() {
    return this.productsUpdate.asObservable();
  }

  addCategory(newCategory:string, categoryImage:File|string) {
    console.log("data : " + newCategory)
    const categoryData = new FormData();
    categoryData.append( "newCategory",newCategory);
    categoryData.append( "categoryImage", categoryImage);

    return this.http
      .post<{ message: string, category: any }>(
        'http://localhost:3000/api/admin/products/category',
        categoryData
      ).pipe(map(category => {
        this.toastr.success(category.category.category + " category Is successfully created", "Signup Successful",{
          timeOut:1000,
          progressBar:true,
        })
        return category
      }));
  }
  addFlavor(newFlavors:string) {
    console.log("data : " + newFlavors)
    const flavorData: Flavor = {
      newFlavors: newFlavors
    }
    return this.http
      .post<{ message: string, flavor: any }>(
        'http://localhost:3000/api/admin/products/flavor',
        flavorData
      ).pipe(map(flavor => {
        this.toastr.success(flavor.flavor.flavor + " flavor Is successfully created", "Created Successful",{
          timeOut:1000,
          progressBar:true,
        })
        return flavor
      }));
  }

  addProduct(
    itemName:string,
    itemCategory:string,
    itemFlavors:string,
    itemPrice:number,
    itemImage:File,
  ) {
    const product = new FormData();
     product.append("itemName", itemName);
     product.append("itemFlavors", itemFlavors);
     product.append("itemMRP", itemPrice.toString());
     product.append("itemCategory", itemCategory);
     product.append("itemImage", itemImage, itemName);

    this.http
      .post<{ message: string }>(
        'http://localhost:3000/api/admin/products',
        product
      )
      .subscribe((responseData: any) => {
        this.router.navigate(['/admin/products']);
      });
  }

  updateProduct(
    itemId:string,
    itemName:string,
    itemPrice:number,
    itemCategory:string,
    itemFlavors:string,
    itemImage:File | string
    ) {
    let product: Product | FormData;
    if (typeof itemImage === "object") {
      product = new FormData();
      product.append("itemId", itemId);
      product.append("itemName", itemName);
      product.append("itemFlavors", itemFlavors);
      product.append("itemMRP", itemPrice.toString());
      product.append("itemCategory", itemCategory);
      product.append("itemImage", itemImage, itemName);
    } else {
      product = {
        itemId: itemId,
        itemName: itemName,
        itemMRP: itemPrice,
        itemCategory: itemCategory,
        itemFlavors: itemFlavors,
        itemImage: itemImage,
      };
    }
    this.http
      .put<{ message:string, itemImage:string}>("http://localhost:3000/api/admin/products/" + itemId, product)
      .subscribe((response) => {
        this.router.navigate(["/admin/products"]);
      });
  }

  deleteProduct(itemId: string) {
    return this.http
      .delete("http://localhost:3000/api/admin/products/" + itemId);
  }

  deleteCategory(categoryId: string){
    return this.http
      .delete("http://localhost:3000/api/admin/products/categorys/" + categoryId);
  }

  deleteFlavor(flavorId: string){
    return this.http
      .delete("http://localhost:3000/api/admin/products/flavors/" + flavorId);
  }


}
