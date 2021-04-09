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

  public products: Product[] = [
    {itemName: "1/2 LITER-ALFANSO MANGO", itemImage:"https://pngimg.com/uploads/mango/mango_PNG9163.png", itemCategory: "Mango", itemFlavors:"Bars", itemMRP: 165},
    {itemName: "1/2 LITER-ANJEER BADAM", itemImage:"https://freepngimg.com/thumb/almond/5-2-almond-png-picture-thumb.png", itemCategory: "Badam", itemFlavors:"Bars", itemMRP: 165},
    {itemName: "1/2 LITER-APRICOT", itemImage:"http://pngimg.com/uploads/apricot/apricot_PNG12647.png", itemCategory: "Apricot", itemFlavors:"Bars", itemMRP: 0},
    {itemName: "1/2 LITER-BELGIUM DARK CHOCOLATE", itemImage:"https://www.pngarts.com/files/3/Dark-Chocolate-PNG-Picture.png", itemCategory: "Chocolate", itemFlavors:"Bars", itemMRP: 165},
    {itemName: "1/2 LITER-BERRY BONANZA", itemImage:"https://webstockreview.net/images/berries-clipart-single-6.png", itemCategory: "Berry", itemFlavors:"Bars", itemMRP: 0},
    {itemName: "1/2 LITER-BLACK CURRENT", itemImage:"https://lh3.googleusercontent.com/proxy/gGq1FTz0UGmqGggTxCa-e3QtgGjONMh6OAzarnQeQrpvL6rPRzkcGcBdN6szsQGV_gcm49DAmORk8YR5wWRXvFRqFMaan8I40z7vqkE_E4A9_IN_G3LMGatPa2c_DCzAwf5D", itemCategory: "Current", itemFlavors:"Bars", itemMRP: 0},
    {itemName: "1/2 LITER-BUTTER SCOTCH", itemImage:"https://i2.wp.com/srimadhuramcatering.com/wp-content/uploads/2020/08/butter-scotch-scoop.png?fit=600%2C600&ssl=1", itemCategory: "Butter Scotch", itemFlavors:"Bars", itemMRP: 115},
  ];
  private productsUpdate = new Subject<Product[]>();
  public categorys: Category[];
  private categorysUpdate = new Subject<Category[]>();
  public flavors: Flavor[];
  private flavorsUpdate = new Subject<Flavor[]>();


constructor(private http: HttpClient, private router: Router, private toastr: ToastrService) { }

  ngOnInit(){
    this.products = [
      {itemName: "1/2 LITER-ALFANSO MANGO", itemImage:"https://pngimg.com/uploads/mango/mango_PNG9163.png", itemCategory: "Mango", itemFlavors:"Bars", itemMRP: 165},
      {itemName: "1/2 LITER-ANJEER BADAM", itemImage:"https://freepngimg.com/thumb/almond/5-2-almond-png-picture-thumb.png", itemCategory: "Badam", itemFlavors:"Bars", itemMRP: 165},
      {itemName: "1/2 LITER-APRICOT", itemImage:"http://pngimg.com/uploads/apricot/apricot_PNG12647.png", itemCategory: "Apricot", itemFlavors:"Bars", itemMRP: 0},
      {itemName: "1/2 LITER-BELGIUM DARK CHOCOLATE", itemImage:"https://www.pngarts.com/files/3/Dark-Chocolate-PNG-Picture.png", itemCategory: "Chocolate", itemFlavors:"Bars", itemMRP: 165},
      {itemName: "1/2 LITER-BERRY BONANZA", itemImage:"https://webstockreview.net/images/berries-clipart-single-6.png", itemCategory: "Berry", itemFlavors:"Bars", itemMRP: 0},
      {itemName: "1/2 LITER-BLACK CURRENT", itemImage:"https://lh3.googleusercontent.com/proxy/gGq1FTz0UGmqGggTxCa-e3QtgGjONMh6OAzarnQeQrpvL6rPRzkcGcBdN6szsQGV_gcm49DAmORk8YR5wWRXvFRqFMaan8I40z7vqkE_E4A9_IN_G3LMGatPa2c_DCzAwf5D", itemCategory: "Current", itemFlavors:"Bars", itemMRP: 0},
      {itemName: "1/2 LITER-BUTTER SCOTCH", itemImage:"https://i2.wp.com/srimadhuramcatering.com/wp-content/uploads/2020/08/butter-scotch-scoop.png?fit=600%2C600&ssl=1", itemCategory: "Butter Scotch", itemFlavors:"Bars", itemMRP: 115},
    ];
  }

  getProducts() {
    this.http
      .get<{ message: string; product: any }>("http://localhost:3000/api/admin/products")
      .pipe(
        map((productData) => {
          return productData.product.map((product) => {
            return {
              itemId:product._id,
              itemName: product.itemName,
              itemCategory: product.itemCategory,
              itemMRP: product.itemMRP,
              itemImage: product.itemImgUrl,
              itemFlavors: product.itemFlavors,
            };
          });
        })
      )
      .subscribe((transformPosts) => {
        this.products = transformPosts;
        this.productsUpdate.next([...this.products]);
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
                  newFlavors: categorys.flavors
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
                  newFlavors: flavors.flavor
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

  addCategory(newCategory:string) {
    console.log("data : " + newCategory)
    const categoryData: Category = {
      newCategory: newCategory
    }
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
    // const product: Product = {
    //   itemName: itemName,
    //   itemFlavors: itemFlavors,
    //   itemMRP: itemPrice,
    //   itemCategory: itemCategory,
    //   itemImage: itemImage
    // };
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
        console.log('responseData :' + responseData.message);
        const product : Product = {itemName: itemName, itemMRP: itemPrice, itemCategory: itemCategory, itemFlavors: itemFlavors, itemImage:""}
        this.products.push(product);
        this.productsUpdate.next([...this.products]);
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
        const updatedProduct = [...this.products];
        const oldProductIndex = updatedProduct.findIndex((p) => p.itemId === itemId);
        const product: Product = {
          itemId: itemId,
          itemName: itemName,
          itemMRP: itemPrice,
          itemCategory: itemCategory,
          itemFlavors: itemFlavors,
          itemImage: response.itemImage,
        };
        updatedProduct[oldProductIndex] = product;
        this.products = updatedProduct;
        this.productsUpdate.next([...this.products]);
        this.router.navigate(["/admin/products"]);
      });
  }

  deleteProduct(itemId: string) {
    this.http
      .delete("http://localhost:3000/api/admin/products/" + itemId)
      .subscribe(() => {
        const updatedPost = this.products.filter((post) => post.itemId !== itemId);
        this.products = updatedPost;
        this.productsUpdate.next([...this.products]);
      });
  }


}
