import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatBottomSheet, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/auth.service';
import { ThemeService } from 'src/app/theme.service';
import Swal from 'sweetalert2';
import { Category, Flavor, Product } from '../product.model';
import { ProductsService } from '../products.service';
import { mimeType } from './mime-type.validator';

@Component({
  selector: 'app-new-product',
  templateUrl: './new-product.component.html',
  styleUrls: ['./new-product.component.scss']
})
export class NewProductComponent implements OnInit {

  form: FormGroup;
  formCategory: FormGroup;
  imagePreview: string | File = "";
  upImage = "Upload Image";
  isLoading: boolean = false;
  categorys:Category[];
  flavors:Flavor[];
  mode = "create";
  itemId:string;
  product:Product;
  isSubmit:boolean=false;

  constructor(public theme:ThemeService, private toastr: ToastrService, private auth:AuthService, private _bottomSheet: MatBottomSheet, public route: ActivatedRoute, public productsService: ProductsService) { }

  ngOnInit() {
    this.form = new FormGroup({
      itemName: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)],
      }),
      itemPrice: new FormControl(null, { validators: [Validators.required] }),
      itemCategory: new FormControl(null, { validators: [Validators.required] }),
      itemflavors: new FormControl(null, { validators: [Validators.required] }),
      itemImage: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType],
      }),
    });
    this.formCategory = new FormGroup({
      newCategory: new FormControl(null, {
        validators: [Validators.required],
      }),
      newFlavors: new FormControl(null, {
        validators: [Validators.required],
      }),
    })
    this.isLoading = true;
    this.productsService.getCategory();
    this.productsService.getUpdateCategory().subscribe((category: Category[]) => {
      this.isLoading = false;
      this.categorys = category;
    });
    this.isLoading = true;
    this.productsService.getFlavor();
    this.productsService.getUpdateFlavor().subscribe((flavor: Flavor[]) => {
      this.isLoading = false;
      this.flavors = flavor;
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has("itemId")) {
        this.mode = "edit";
        this.itemId = paramMap.get("itemId");
        this.isLoading = true;
        this.productsService.getProduct(this.itemId).subscribe((productdata) => {
          this.isLoading = false;
          this.product = {
            itemId: productdata._id,
            itemName: productdata.itemName,
            itemMRP: productdata.itemMRP,
            itemImage: productdata.itemImgUrl,
            itemCategory: productdata.itemCategory,
            itemFlavors: productdata.itemFlavors,
          };
          this.form.setValue({
            itemName: this.product.itemName,
            itemPrice: this.product.itemMRP,
            itemCategory: this.product.itemCategory,
            itemflavors: this.product.itemFlavors,
            itemImage: this.product.itemImage,
          });
          this.imagePreview = this.product.itemImage
        });
      } else {
        this.mode = "create";
        this.itemId = null;
      }
    });
  }

  deleteCategory(category: Category){
    Swal.fire({
      title: 'Warning',
      text: "Are you sure you want to permanently delete this category"+"'"+category.newCategory+"'",
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
                      this.productsService.deleteCategory(category.categoryId).subscribe(() => {
                        this.productsService.getCategory()
                        this.isLoading = false;
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
  deleteFlavor(flavor:Flavor){
    Swal.fire({
      title: 'Warning',
      text: "Are you sure you want to permanently delete this flavor"+"'"+flavor.newFlavors+"'",
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
                      this.productsService.deleteFlavor(flavor.flavorId).subscribe(() => {
                        this.productsService.getFlavor()
                        this.isLoading = false;
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

  onImagePick(event: Event){
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({ itemImage: file });
    this.form.get("itemImage").updateValueAndValidity();
    const render = new FileReader();
    render.onload = () => {
      this.imagePreview = render.result as string;
      if (this.imagePreview && this.form.get('itemImage').valid){
        this.upImage = "Change Image";
      }else {
        this.upImage = "Upload Image";
      }
    };
    render.readAsDataURL(file);
  }

  addNewCategory(){
    this._bottomSheet.open(NewCategory);
  }
  addNewFlavor(){
    this._bottomSheet.open(NewFlavor);
  }

  onSaveProduct(){
    this.isSubmit = true;
    if(this.form.invalid){
      return;
    }
    if (this.mode==="create") {
      this.productsService.addProduct(
        this.form.value.itemName,
        this.form.value.itemCategory,
        this.form.value.itemflavors,
        this.form.value.itemPrice,
        this.form.value.itemImage
      );
    } else {
      this.productsService.updateProduct(
        this.itemId,
        this.form.value.itemName,
        this.form.value.itemPrice,
        this.form.value.itemCategory,
        this.form.value.itemflavors,
        this.form.value.itemImage
      )
    }
  }

}

@Component({
  selector: 'new-category',
  templateUrl: 'new-category.html',
  styleUrls: ['./new-product.component.scss'],
  providers: [NewProductComponent]
})
export class NewCategory implements OnInit{
  formCategory: FormGroup;
  isLoading:boolean = false;
  imagePreview: string | File = "";
  upImage = "Upload Image";
  isSubmit:boolean=false;
  constructor(private _bottomSheetRef: MatBottomSheetRef<NewCategory>,public newProductComponent:NewProductComponent, public productsService: ProductsService) {}

  ngOnInit(){
    this.formCategory = new FormGroup({
      newCategory: new FormControl(null, {
        validators: [Validators.required],
      }),
      categoryImage: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType],
      })
    });
  }

  openLink(event: MouseEvent): void {
    this._bottomSheetRef.dismiss();
    event.preventDefault();
  }
  close(){
    this._bottomSheetRef.dismiss();
  }
  onCatImagePick(event: Event){
    const file = (event.target as HTMLInputElement).files[0];
    this.formCategory.patchValue({ categoryImage: file });
    this.formCategory.get("categoryImage").updateValueAndValidity();
    const render = new FileReader();
    render.onload = () => {
      this.imagePreview = render.result as string;
      if (this.imagePreview && this.formCategory.get('categoryImage').valid){
        this.upImage = "Change Image";
      }else {
        this.upImage = "Upload Image";
      }
    };
    render.readAsDataURL(file);
  }
  onSaveCategory(){
    this.isSubmit = true;
    if (this.formCategory.invalid){
      return;
    }
    this.isLoading = true;
    this.newProductComponent.isLoading = true;
    this.productsService.addCategory(this.formCategory.value.newCategory,this.formCategory.value.categoryImage)
      .pipe(first())
      .subscribe(
        (data) => {
          this.productsService.getCategory();
          this.productsService.getUpdateCategory().subscribe(cat =>{
            this.newProductComponent.categorys = cat;
            this._bottomSheetRef.dismiss();
          })
        },
        (error) => {
          this.newProductComponent.isLoading = false;
          this.isLoading = false;
          this._bottomSheetRef.dismiss();
        }
      );
  }
}
@Component({
  selector: 'new-flavor',
  templateUrl: 'new-flavor.html',
  providers: [NewProductComponent]
})
export class NewFlavor {
  isLoading:boolean = false;
  constructor(private _bottomSheetRef: MatBottomSheetRef<NewFlavor>,private newProductComponent: NewProductComponent, private productsService: ProductsService) {}

  openLink(event: MouseEvent): void {
    this._bottomSheetRef.dismiss();
    event.preventDefault();
  }
  close(){
    this._bottomSheetRef.dismiss();
  }
  onSaveFlavor(flavors: HTMLInputElement) {
    if (!flavors.value){
      return;
    }
    this.isLoading = true;
    this.newProductComponent.isLoading = true;
    this.productsService.addFlavor(flavors.value)
      .pipe(first())
      .subscribe(
        (data) => {
          this.productsService.getFlavor();
        },
        (error) => {
          this.isLoading = false;
          this.newProductComponent.isLoading = false;
          this._bottomSheetRef.dismiss();
        }
      );
  }
}
