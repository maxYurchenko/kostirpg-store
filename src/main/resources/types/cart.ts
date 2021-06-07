import { Content } from "enonic-types/content";

export interface Cart extends Content {
  name?: string;
  surname?: string;
  country?: string;
  address?: string;
  city?: string;
  phone?: string;
  email?: string;
  step?: string;
  ik_id?: string;
  shipping?: string;
  status?: CART_STATES;
  userId?: string;
  shippingPrice?: string;
  price?: CartPrice;
  transactionDate?: string;
  items?: Array<CartItem | CartItemProcessed>;
  itemsNum: number;
  itemsWeight: number;
  dates: CartDates;
  promos: Array<string>;
  stock: boolean;
}

export interface CartDiscount {
  discount: number;
  codes: Array<Code>;
}

interface Code {
  displayName: string;
  type: string;
  discount: number;
  code: string;
}

export interface CartPrice {
  items: number;
  shipping: number;
  discount: CartDiscount;
  totalDiscount: number;
  total: number;
  currency: string;
}

export interface CartItem {
  id: string;
  amount: number;
  itemSize?: string;
  itemsIds?: {
    id?: string;
    activated?: boolean;
  };
  transactionPrice?: number;
}

export interface CartDates {
  createdDate: string;
  createdTime: string;
  transactionDate: string;
  transactionTime: string;
}
export interface CartItemProcessed extends CartItem {
  _id: string;
  displayName: string;
  stock: boolean;
  preorder: boolean;
  price: number;
  finalPrice: number;
  digital: boolean;
  ticketType: string;
  productType: string;
  itemSizeStock: boolean;
  imageCart: any;
  imageSummary: any;
}

declare type CART_STATES =
  | "created"
  | "pending"
  | "failed"
  | "shipped"
  | "paid";

export function isCartItemProcessed(arg: CartItem): arg is CartItemProcessed {
  return (arg as CartItemProcessed).displayName !== undefined;
}
