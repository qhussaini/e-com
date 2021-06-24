import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ProductsService } from '../admin/products.service';
import { AuthService } from '../auth/auth.service';
import { ShoppingCartService } from '../my-order/shopping-cart.service';
import { ThemeService } from '../theme.service';

@Component({
  selector: 'app-order-placed',
  templateUrl: './order-placed.component.html',
  styleUrls: ['./order-placed.component.scss']
})
export class OrderPlacedComponent implements OnInit {

  isLoading:boolean = false;
  placedOrder:any;
  orderedProduct:any[] = [];
  orderStatus:string;
  qty:any[]=[];
  date:Date;
  adMode = false;
  userName:string;
  orderId:string;
  userId:string;
  statusColor:string;
  statusBar:number = 0;
  statusAnm:boolean = true;
  pStataus:boolean = false;
  cStataus:boolean = false;
  odStataus:boolean = false;
  dStataus:boolean = false;

  constructor(public theme: ThemeService, private auth: AuthService, private products: ProductsService, private route: ActivatedRoute, private cart: ShoppingCartService, private toastr: ToastrService) { }

  ngOnInit() {
    this.isLoading = true;
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has("orderId")) {
        this.orderId = paramMap.get("orderId");
        if (paramMap.has("userId")){
          this.adMode = true;
          this.userId = paramMap.get("userId");
          this.userName = paramMap.get("userName");
          this.cart.getOrderDetailsAd(this.orderId,this.userId).subscribe((data) => {
            this.placedOrder = data.order;
            let orderTime = new Date(this.placedOrder.orderDate)
            this.orderStatus = this.placedOrder.orderStatus;
            this.date = orderTime;
            this.placedOrder.product.productId.forEach(val =>{
              this.products.getProduct(val.itemId).subscribe((product) => {
                this.orderedProduct.push(product);
                this.qty.push(val.productQty);
                this.isLoading = false;
                if (this.orderStatus.toLocaleLowerCase()==="pending") {
                  this.statusBar = 25;
                  this.statusColor = "warning";
                }else if (this.orderStatus.toLocaleLowerCase()==="confirmed"){
                  this.statusBar = 50;
                  this.statusColor = "info";
                }else if (this.orderStatus.toLocaleLowerCase()==="ofd"){
                  this.statusBar = 75;
                  this.statusColor = "secondary";
                }else if (this.orderStatus.toLocaleLowerCase()==="delivered"){
                  this.statusBar = 100;
                  this.statusColor = "success";
                  this.statusAnm = false;
                }else if(this.orderStatus.toLocaleLowerCase()==="cancelled"){
                  this.statusBar = 100;
                  this.statusColor = "danger";
                  this.statusAnm = false;
                }
              })
            })
          })
        }else {
          this.cart.getMyOrderDetails(this.orderId).subscribe((data) => {
            this.placedOrder = data.order;
            let orderTime = new Date(this.placedOrder.orderDate)
            this.orderStatus = this.placedOrder.orderStatus;
            this.date = orderTime;
            this.placedOrder.product.productId.forEach(val =>{
              this.products.getProduct(val.itemId).subscribe((product) => {
                this.orderedProduct.push(product);
                this.qty.push(val.productQty);
                this.isLoading = false;
                if (this.orderStatus.toLocaleLowerCase()==="pending") {
                  this.statusBar = 25;
                  this.statusColor = "warning";
                }else if (this.orderStatus.toLocaleLowerCase()==="confirmed"){
                  this.statusBar = 50;
                  this.statusColor = "info";
                }else if (this.orderStatus.toLocaleLowerCase()==="ofd"){
                  this.statusBar = 75;
                  this.statusColor = "secondary";
                }else if (this.orderStatus.toLocaleLowerCase()==="delivered"){
                  this.statusBar = 100;
                  this.statusColor = "success";
                  this.statusAnm = false;
                }else if(this.orderStatus.toLocaleLowerCase()==="cancelled"){
                  this.statusBar = 100;
                  this.statusColor = "danger";
                  this.statusAnm = false;
                }
              })
            })
          })
        }
      }
    })
  }

  print(isDeliver?:string){
    let printContent1, printContent2, popupWin;
    printContent1 = document.getElementById('order').innerHTML;
    printContent2 = document.getElementById('orderTable').innerHTML;
    popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    popupWin.document.open();
    popupWin.document.write(`
      <html>
        <head>
          <title>${this.userName}</title>
          <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-+0n0xVW2eSR5OomGNYDnhzAbDsOXxcvSN1TPprVMTNDbiYZCxYbOOl7+AMvyTG2x" crossorigin="anonymous">
        </head>
        <body onload="window.print();window.close()">
        ${printContent1}
        ${printContent2}
        </body>
      </html>`
    );
    popupWin.document.close();
    if(isDeliver) {
      this.cart.confirmOrder(this.userId,this.orderId,"ofd").subscribe(a => {
        this.isLoading = true;
        this.statusAnm = true;
        this.orderedProduct = [];
        this.ngOnInit();
        this.toastr.info("Order status changed to out for delivery", "Order status", {
          timeOut:3500,
          progressBar:true,
        })
        this.isLoading = false;
      });
    }
  }
  orderCancel(){
    this.cart.confirmOrder(this.userId,this.orderId,"Cancelled").subscribe(a => {
      this.isLoading = true;
      this.statusAnm = true;
      this.orderedProduct = [];
      this.ngOnInit();
      this.toastr.info("Order cancelled", " ", {
        timeOut:3500,
        progressBar:true,
      })
      this.isLoading = false;
    });
  }
  orderDelivered(){
    this.cart.confirmOrder(this.userId,this.orderId,"Delivered").subscribe(a => {
      this.isLoading = true;
      this.statusAnm = true;
      this.orderedProduct = [];
      this.ngOnInit();
      this.toastr.info("Order status changed to delivered", "Order status", {
        timeOut:3500,
        progressBar:true,
      })
      this.isLoading = false;
    });
  }
}
