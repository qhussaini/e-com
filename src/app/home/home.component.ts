import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbCarousel, NgbSlideEvent, NgbSlideEventSource } from '@ng-bootstrap/ng-bootstrap';
import { ProductsService } from '../admin/products.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  images = [62, 83, 466, 965, 982, 1043, 738].map((n) => `https://picsum.photos/id/${n}/900/500`);

  paused = false;
  unpauseOnArrow = false;
  pauseOnIndicator = false;
  pauseOnHover = true;
  pauseOnFocus = true;
  shopcard = [];

  @ViewChild('carousel', {static : true}) carousel: NgbCarousel;

  constructor(public product:ProductsService) { }

  ngOnInit() {

    this.shopcard = [
      {cardTitle: "Find your ideal Ice Creams", cardImgUrl:"https://media-cdn.tripadvisor.com/media/photo-s/0c/9f/c9/d6/close-up-of-other-sundae.jpg", cardDetail:"1 Liter bars of all flavors"},
      {cardTitle: "Find your ideal Ice Creams", cardImgUrl:"https://media-cdn.tripadvisor.com/media/photo-s/0c/9f/c9/d6/close-up-of-other-sundae.jpg", cardDetail:"1 Liter bars of all flavors"},
      {cardTitle: "Find your ideal Ice Creams", cardImgUrl:"https://media-cdn.tripadvisor.com/media/photo-s/0c/9f/c9/d6/close-up-of-other-sundae.jpg", cardDetail:"1 Liter bars of all flavors"},
    ]
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
