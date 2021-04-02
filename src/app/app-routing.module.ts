import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminProductComponent } from './admin/admin-product/admin-product.component';
import { NewProductComponent } from './admin/new-product/new-product.component';
import { OrdersComponent } from './admin/orders/orders.component';
import { AuthGuard } from './auth/auth-guard';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { HomeComponent } from './home/home.component';
import { MyOrderComponent } from './my-order/my-order.component';

const routes: Routes = [
  {path:"" , component: HomeComponent },
  {path:"login" , component: LoginComponent },
  {path:"signup" , component: SignupComponent },
  {path:"admin/dash" , component: SignupComponent, canActivate: [AuthGuard] },
  {path:"admin/order" , component: OrdersComponent, canActivate: [AuthGuard] },
  {path:"admin/add-new-product" , component: NewProductComponent, canActivate: [AuthGuard] },
  {path:"admin/products" , component: AdminProductComponent, canActivate: [AuthGuard] },
  {path:"my-order" , component: MyOrderComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule { }
