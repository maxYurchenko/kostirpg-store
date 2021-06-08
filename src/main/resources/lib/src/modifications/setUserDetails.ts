import { Cart, CartPrice, CART_STATES } from "../../../types/cart";
import { connectCartRepo, getNextId } from "../helpers/repo";
import { getCart } from "../getCart";
import * as contextLib from "../helpers/contextLib";

export { setUserDetails, modifyCartWithParams };

function setUserDetails(cartId: string, params: CartUpdateRequest) {
  var cartRepo = connectCartRepo();
  cartRepo.modify({
    key: cartId,
    editor: editor
  });

  function editor(node: Cart) {
    node.country = params.country ? params.country : node.country;
    node.address = params.address ? params.address : node.address;
    node.city = params.city ? params.city : node.city;
    node.phone = params.phone ? params.phone : node.phone;
    node.surname = params.surname ? params.surname : node.surname;
    node.name = params.name ? params.name : node.name;
    node.shipping = params.shipping ? params.shipping : node.shipping;
    node.email = params.email ? params.email : node.email;
    node.cartId = params.cartId ? params.cartId : node.cartId;
    node.step = params.step ? params.step : node.step;
    node.status = params.status ? params.status : node.status;
    node.userId = node.userId ? node.userId : getNextId();
    node.index = params.index ? params.index : node.index;
    node.comment = params.comment ? params.comment : node.comment;
    node.paymentMethod = params.paymentMethod
      ? params.paymentMethod
      : node.paymentMethod;
    node.userRelation = params.userRelation
      ? params.userRelation
      : node.userRelation;
    node.transactionDate = params.transactionDate
      ? new Date(params.transactionDate)
      : node.transactionDate;
    node.novaPoshtaСity = params.novaPoshtaСity
      ? params.novaPoshtaСity
      : node.novaPoshtaСity;
    node.novaPoshtaWarehouse = params.novaPoshtaWarehouse
      ? params.novaPoshtaWarehouse
      : node.novaPoshtaWarehouse;
    node.novaPoshtaWarehouseId = params.novaPoshtaWarehouseId
      ? params.novaPoshtaWarehouseId
      : node.novaPoshtaWarehouseId;
    node.shippingPrice = params.shippingPrice
      ? params.shippingPrice
      : node.shippingPrice;
    node.trackNum = params.trackNum ? params.trackNum : node.trackNum;
    node.price = params.price ? params.price : node.price;
    node.ik_inv_id = params.ik_inv_id ? params.ik_inv_id : node.ik_inv_id;
    node.checkoutRules =
      params.checkoutRules && params.checkoutRules === "on"
        ? true
        : node.checkoutRules;
    return node;
  }
  return getCart(cartId);
}

function modifyCartWithParams(id: string, params: Cart) {
  return contextLib.runAsAdmin(function () {
    return setUserDetails(id, params);
  });
}

interface CartUpdateRequest {
  country?: string;
  address?: string;
  city?: string;
  phone?: string;
  surname?: string;
  name?: string;
  shipping?: string;
  email?: string;
  cartId?: string;
  step?: string;
  status?: CART_STATES;
  userId?: number;
  index?: string;
  comment?: string;
  paymentMethod?: string;
  userRelation?: string;
  transactionDate?: Date;
  novaPoshtaСity?: string;
  novaPoshtaWarehouse?: string;
  novaPoshtaWarehouseId?: string;
  shippingPrice?: string;
  trackNum?: string;
  price?: CartPrice;
  ik_inv_id?: string;
  checkoutRules?: boolean | string;
}
