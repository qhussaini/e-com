import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminProductComponent } from './admin/admin-product/admin-product.component';
import { NewProductComponent } from './admin/new-product/new-product.component';
import { OrdersComponent } from './admin/orders/orders.component';
import { AuthGuard } from './auth/auth-guard';
import { AuthGuardAdmin } from './auth/auth-guard-admin';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { HomeComponent } from './home/home.component';
import { MyOrderComponent } from './my-order/my-order.component';

const routes: Routes = [
  {path:"" , component: HomeComponent },
  {path:"login" , component: LoginComponent },
  {path:"signup" , component: SignupComponent },
  {path:"admin/dash" , component: SignupComponent, canActivate: [AuthGuardAdmin] },
  {path:"admin/order" , component: OrdersComponent, canActivate: [AuthGuardAdmin] },
  {path:"admin/add-new-product" , component: NewProductComponent, canActivate: [AuthGuardAdmin] },
  {path:"admin/products" , component: AdminProductComponent, canActivate: [AuthGuardAdmin] },
  {path:"my-order" , component: MyOrderComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard, AuthGuardAdmin]
})
export class AppRoutingModule { }
