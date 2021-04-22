import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgbCarousel, NgbSlideEvent, NgbSlideEventSource } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { Category, Product } from '../admin/product.model';
import { ProductsService } from '../admin/products.service';
import { ThemeService } from '../theme.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  images = [62, 83, 466, 965, 982, 1043, 738].map((n) => `https://picsum.photos/id/${n}/900/500`);

  paused = false;
  unpauseOnArrow = false;
  pauseOnIndicator = false;
  pauseOnHover = true;
  pauseOnFocus = true;
  productSub:Subscription;
  shopcard = [];
  products: Product[];
  category: Category[];
  isLoading:boolean = false;
  productPerPage: number = 3;
  currentPage: number = 1;
  totalProducts: number = 0;

  @ViewChild('carousel', {static : true}) carousel: NgbCarousel;

  constructor(public productService:ProductsService, public theme:ThemeService) { }

  ngOnInit() {
    this.isLoading = true;
    this.shopcard = [
      {cardTitle: "Find your ideal Ice Creams", cardImgUrl:"https://media-cdn.tripadvisor.com/media/photo-s/0c/9f/c9/d6/close-up-of-other-sundae.jpg", cardDetail:"1 Liter bars of all flavors"},
      {cardTitle: "Find your ideal Ice Creams", cardImgUrl:"https://media-cdn.tripadvisor.com/media/photo-s/0c/9f/c9/d6/close-up-of-other-sundae.jpg", cardDetail:"1 Liter bars of all flavors"},
      {cardTitle: "Find your ideal Ice Creams", cardImgUrl:"https://media-cdn.tripadvisor.com/media/photo-s/0c/9f/c9/d6/close-up-of-other-sundae.jpg", cardDetail:"1 Liter bars of all flavors"},
    ]
    this.productService.getProducts(this.productPerPage,this.currentPage);
    this.productSub = this.productService.getUpdateProduct().subscribe((productData: {product:Product[], productCount:number}) => {
      this.totalProducts = productData.productCount;
      this.products = productData.product;
    });
    this.productService.getCategory()
    this.productService.getUpdateCategory().subscribe(category => {
      this.category = category;
      this.isLoading = false;
    })
  }
  ngOnDestroy() {
    this.productSub.unsubscribe();
  }

  togglePaused() {
    if (this.paused) {
      this.carousel.cycle();
    } else {
      this.carousel.pause();
    }
    this.paused = !this.paused;
  }


  onSlide(slideEvent: NgbSlideEvent) {
    if (this.unpauseOnArrow && slideEvent.paused &&
      (slideEvent.source === NgbSlideEventSource.ARROW_LEFT || slideEvent.source === NgbSlideEventSource.ARROW_RIGHT)) {
      this.togglePaused();
    }
    if (this.pauseOnIndicator && !slideEvent.paused && slideEvent.source === NgbSlideEventSource.INDICATOR) {
      this.togglePaused();
    }
  }


}
