import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminProductComponent } from './admin/admin-product/admin-product.component';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { NewProductComponent } from './admin/new-product/new-product.component';
import { OrdersComponent } from './admin/orders/orders.component';
import { AuthGuard } from './auth/auth-guard';
import { AuthGuardAdmin } from './auth/auth-guard-admin';
import { ConfirmComponent } from './auth/confirm/confirm.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { CartComponent } from './cart/cart.component';
import { HomeComponent } from './home/home.component';
import { MyOrderComponent } from './my-order/my-order.component';
import { ProductListComponent } from './product-list/product-list.component';

const routes: Routes = [
  {path:"" , component: HomeComponent },
  {path:"products" , component: ProductListComponent },
  {path:"login" , component: LoginComponent },
  {path:"signup" , component: SignupComponent },
  {path:"account/confirm" , component: ConfirmComponent },
  {path:"admin/dash" , component: DashboardComponent, canActivate: [AuthGuardAdmin] },
  {path:"admin/order" , component: OrdersComponent, canActivate: [AuthGuardAdmin] },
  {path:"admin/add-new-product" , component: NewProductComponent, canActivate: [AuthGuardAdmin] },
  {path:"admin/edit-product/:itemId" , component: NewProductComponent, canActivate: [AuthGuardAdmin] },
  {path:"admin/products" , component: AdminProductComponent, canActivate: [AuthGuardAdmin] },
  {path:"my-order" , component: MyOrderComponent, canActivate: [AuthGuard] },
  {path:"cart" , component: CartComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard, AuthGuardAdmin]
})
export class AppRoutingModule { }
