export interface Product {
  itemId?: string;
  itemName: string;
  itemCategory: string;
  itemMRP: number;
  itemImage?:File|string;
  itemFlavors: string;
  quantity?:number;
  totalPrice?:number;
}
export interface OrederProduct {
  userName: string;
  products:Product[];
  totalPrice:number;
}
export interface Category {
  categoryId?:String;
  newCategory: string;
}
export interface Flavor {
  flavorId?:String;
  newFlavors: string;
}
