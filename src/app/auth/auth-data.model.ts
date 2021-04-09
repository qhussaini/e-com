export interface AuthData {
  id?:string
  email: string;
  shopName?: string;
  shopNumber?: number;
  userName?: string;
  passWord?: string;
  userType?: string;
  expiresIn?: number;
  token?: string;
}
