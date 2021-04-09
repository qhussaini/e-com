export interface Product {
  itemId?: string;
  itemName: string;
  itemCategory: string;
  itemMRP: Number;
  itemImage?:File|string;
  itemFlavors: string;
}
export interface Category {
  newCategory: string;
}
export interface Flavor {
  newFlavors: string;
}
