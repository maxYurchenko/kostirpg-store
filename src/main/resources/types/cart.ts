import { Content } from "enonic-types/content";
import { RepoNode } from "enonic-types/node";
import { Product } from "../site/content-types/product/product";

export interface Cart extends RepoNode {
  createdTime: string;
  _ts: string;
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
  userId?: number | string;
  shippingPrice?: string;
  price?: CartPrice;
  transactionPrice?: CartPrice;
  transactionDate?: Date;
  items?: Array<CartItem | CartItemProcessed>;
  itemsNum: number;
  itemsWeight: number;
  dates: CartDates;
  promos: Array<string>;
  stock: boolean;
  currentTicketType?: string;
  qrProduct?: Content<Product>;
  qrActivated: boolean;
  currentFriendlyId: string;
  legendary: boolean;
  cartId: string;
  index: string;
  comment: string;
  paymentMethod: string;
  userRelation: string;
  novaPoshtaСity: string;
  novaPoshtaWarehouse: string;
  novaPoshtaWarehouseId: string;
  trackNum: string;
  ik_inv_id: string;
  checkoutRules: boolean | string;
}

export interface CartDiscount {
  discount: {
    shipping: number;
    products: number;
    shippingProducts: number;
    total: number;
  };
  codes?: Array<Code>;
}

export interface Code {
  displayName: string;
  type: string;
  discount: number;
  code: string;
}

export interface CartPrice {
  items: string;
  shipping: string;
  discount: CartDiscount;
  totalDiscount: string;
  total: string;
  currency: string;
}

export interface CartItem {
  id: string;
  amount: number;
  itemSize?: string;
  itemsIds?: Array<CartItemId>;
  transactionPrice?: number;
  generateIds?: number;
}

export interface CartItemId {
  id?: number;
  activated?: boolean;
  friendlyId: number;
}

export interface CartDates {
  createdDate: string;
  createdTime: string;
  transactionDate: string;
  transactionTime: string;
}

export interface CartItemIdProcessed {
  id?: string;
  activated?: boolean;
  friendlyId: string;
}

export interface CartItemProcessed extends CartItem {
  _id: string;
  displayName: string;
  stock: boolean;
  preorder: boolean;
  price: number;
  finalPrice?: number;
  digital: boolean;
  ticketType?: string;
  productType: string;
  itemSizeStock: boolean;
  imageCart: any;
  imageSummary: any;
  amountString: string;
  itemsIdsProcessed?: Array<CartItemIdProcessed>;
}

export interface CartUtils extends RepoNode {
  ticketCount: number;
}

export declare type CART_STATES =
  | "created"
  | "pending"
  | "failed"
  | "shipped"
  | "paid";

export function isCartItemProcessed(arg: CartItem): arg is CartItemProcessed {
  return (arg as CartItemProcessed).displayName !== undefined;
}
