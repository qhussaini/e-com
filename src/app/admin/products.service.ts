import { Injectable } from '@angular/core';
import { Product } from './product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  products: Product[] = [
    {itemName: "1/2 LITER-ALFANSO MANGO", itemImgUrl:"https://pngimg.com/uploads/mango/mango_PNG9163.png", itemCategory: "Mango", itemType:"Bars", itemMRP: 165},
    {itemName: "1/2 LITER-ANJEER BADAM", itemImgUrl:"https://freepngimg.com/thumb/almond/5-2-almond-png-picture-thumb.png", itemCategory: "Badam", itemType:"Bars", itemMRP: 165},
    {itemName: "1/2 LITER-APRICOT", itemImgUrl:"http://pngimg.com/uploads/apricot/apricot_PNG12647.png", itemCategory: "Apricot", itemType:"Bars", itemMRP: 0},
    {itemName: "1/2 LITER-BELGIUM DARK CHOCOLATE", itemImgUrl:"https://www.pngarts.com/files/3/Dark-Chocolate-PNG-Picture.png", itemCategory: "Chocolate", itemType:"Bars", itemMRP: 165},
    {itemName: "1/2 LITER-BERRY BONANZA", itemImgUrl:"https://webstockreview.net/images/berries-clipart-single-6.png", itemCategory: "Berry", itemType:"Bars", itemMRP: 0},
    {itemName: "1/2 LITER-BLACK CURRENT", itemImgUrl:"https://lh3.googleusercontent.com/proxy/gGq1FTz0UGmqGggTxCa-e3QtgGjONMh6OAzarnQeQrpvL6rPRzkcGcBdN6szsQGV_gcm49DAmORk8YR5wWRXvFRqFMaan8I40z7vqkE_E4A9_IN_G3LMGatPa2c_DCzAwf5D", itemCategory: "Current", itemType:"Bars", itemMRP: 0},
    {itemName: "1/2 LITER-BUTTER SCOTCH", itemImgUrl:"https://i2.wp.com/srimadhuramcatering.com/wp-content/uploads/2020/08/butter-scotch-scoop.png?fit=600%2C600&ssl=1", itemCategory: "Butter Scotch", itemType:"Bars", itemMRP: 115},
  ]

constructor() { }

}
