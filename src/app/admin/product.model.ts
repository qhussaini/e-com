export interface Product {
  itemId?: string;
  itemName: string;
  itemCategory: string;
  itemMRP: number;
  itemImage?:File|string;
  itemFlavors: string;
  quantity?:number;
  totalPrice?:number;
  orderStatus?:string;
}
export interface OrederProduct {
  cartId: string;
  userName: string;
  userShop: string;
  userId: string;
  products:Product[];
  totalPrice:number;
  orderStatus:string;
}
export interface Category {
  categoryId?:string;
  newCategory: string;
  categoryImage: File|string;
}
export interface Flavor {
  flavorId?:string;
  newFlavors: string;
}
