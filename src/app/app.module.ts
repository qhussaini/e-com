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

//material-components
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatRippleModule } from '@angular/material/core';
import { MatBadgeModule } from '@angular/material/badge';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { MatPaginatorModule } from '@angular/material/paginator';




import { MyOrderComponent } from './my-order/my-order.component';
import { HomeComponent } from './home/home.component';
import { NewProductComponent } from './admin/new-product/new-product.component';
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
      ProductListComponent
   ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    BrowserAnimationsModule,
    MatSlideToggleModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatTableModule,
    MatToolbarModule,
    MatButtonModule,
    MatCardModule,
    MatRippleModule,
    MatBadgeModule,
    MatBottomSheetModule,
    MatListModule,
    MatSidenavModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    HttpClientModule,
    MatMenuModule,
    SharedModule,
    WidgetModule,
    UIModule,
    ToastrModule.forRoot(),
    FlatpickrModule.forRoot(),
    ChartModule,
    ChartsModule,
    FlexLayoutModule,
    MatSelectModule,
    MatSliderModule,
    MatPaginatorModule,
  ],
  exports: [],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule { }
