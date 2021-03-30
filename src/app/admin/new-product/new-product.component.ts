import { Component, OnInit } from '@angular/core';
import { ThemeService } from 'src/app/theme.service';

@Component({
  selector: 'app-new-product',
  templateUrl: './new-product.component.html',
  styleUrls: ['./new-product.component.scss']
})
export class NewProductComponent implements OnInit {

  constructor(public theme:ThemeService) { }

  ngOnInit() {
  }

}
