import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HeaderComponent } from './header/header.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { ChartModule } from 'angular2-chartjs';
import { ChartsModule } from 'ng2-charts';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MaterialModule } from './material.module';

import { MyOrderComponent } from './my-order/my-order.component';
import { HomeComponent } from './home/home.component';
import { NewCategory, NewFlavor, NewProductComponent } from './admin/new-product/new-product.component';
import { OrdersComponent } from './admin/orders/orders.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { AdminProductComponent } from './admin/admin-product/admin-product.component';
import { FooterComponent } from './footer/footer.component';
import { AuthInterceptor } from './auth/auth-interceptor';
import { SharedModule } from './shared/shared.module';
import { FlatpickrModule } from 'angularx-flatpickr';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { WidgetModule } from './shared/widgets/widget.module';
import { UIModule } from './shared/ui/ui.module';
import { ProductListComponent } from './product-list/product-list.component';
import { ProductCardComponent } from './product-card/product-card.component';
import { CartComponent } from './cart/cart.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { ISlimScrollOptions, NgSlimScrollModule, SLIMSCROLL_DEFAULTS } from 'ngx-slimscroll';
import { CheckOutComponent } from './check-out/check-out.component';
import { OrderPlacedComponent } from './order-placed/order-placed.component';
import { GooglePayButtonModule } from '@google-pay/button-angular';

@NgModule({
  declarations: [
    AppComponent,
      HeaderComponent,
      MyOrderComponent,
      HomeComponent,
      AdminProductComponent,
      NewProductComponent,
      OrdersComponent,
      LoginComponent,
      DashboardComponent,
      SignupComponent,
      FooterComponent,
      ProductListComponent,
      ProductCardComponent,
      CartComponent,
      NewCategory,
      NewFlavor,
      AboutUsComponent,
      CheckOutComponent,
      OrderPlacedComponent
   ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    MaterialModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    SharedModule,
    WidgetModule,
    UIModule,
    ToastrModule.forRoot(),
    FlatpickrModule.forRoot(),
    ChartModule,
    ChartsModule,
    FlexLayoutModule,
    NgSlimScrollModule,
    GooglePayButtonModule
  ],
  exports: [],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    {
      provide: SLIMSCROLL_DEFAULTS,
      useValue: {
        alwaysVisible : false
      } as ISlimScrollOptions
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
