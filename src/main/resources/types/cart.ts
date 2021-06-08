import { RepoNode } from "enonic-types/node";

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
  userId?: number;
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
  qrActivated: boolean;
  currentFriendlyId: number;
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
  discount: number;
  codes?: Array<Code>;
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
