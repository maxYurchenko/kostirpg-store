import { Cart, CartItemId, isCartItemProcessed } from "../../types/cart";
import { connectCartRepo, getNextId } from "./helpers/repo";
import { calculateCartItems } from "./calculations/calculateItems";
import { getCartItems } from "./getItems";
import { caclculateCartWeight } from "./calculations/cartWeight";
import { calculateCart } from "./calculations/calculateCart";
import { checkCartStock } from "./misc/stock";
import { getCartDates } from "./misc/dates";
import { BasicFilters, BooleanFilter, Content } from "enonic-types/content";
import * as contextLib from "./helpers/contextLib";
import { Product } from "../../site/content-types/product/product";

const contentLib = __non_webpack_require__("/lib/xp/content");
const utils = __non_webpack_require__("/lib/util");

export {
  getCart,
  getCartByUserId,
  getCartsByUser,
  getCartByQr,
  getCreatedCarts
};

function getCart(cartId?: string) {
  let cart: Cart;
  if (cartId) {
    let temp = getCartById(cartId);
    if (!temp) {
      temp = createCart();
    }
    cart = temp;
  } else {
    cart = createCart();
  }
  cart.items = getCartItems(cart);
  cart.itemsNum = calculateCartItems(cart.items);
  cart.itemsWeight = caclculateCartWeight(cart.items);
  cart.dates = getCartDates(cart);
  if (!cart.price) {
    cart.price = calculateCart(cart);
  }
  cart.stock = checkCartStock(cart.items);
  if (cart.userId && typeof cart.userId === "number") {
    cart.userId = cart.userId.toFixed();
  }
  return cart;
}

function getCartById(id: string): Cart | null {
  var cartRepo = connectCartRepo();
  try {
    return cartRepo.get(id);
  } catch (e) {
    return createCart();
  }
}

function createCart(): Cart {
  let cart = contextLib.runAsAdmin(function () {
    var cartRepo = connectCartRepo();
    return cartRepo.create({ userId: getNextId() });
  });
  return cart;
}

function getCartByUserId(id: string): Array<Cart> {
  const cartRepo = connectCartRepo();
  let result = [];
  let cart = cartRepo.query({
    query: "userId='" + id + "' or userId=" + id,
    sort: "_ts desc"
  });
  for (var i = 0; i < cart.hits.length; i++) {
    result.push(getCart(cart.hits[i].id));
  }
  return result;
}

function getCartsByUser(
  email: string,
  id: string,
  count: boolean
): Array<Cart> | number {
  var cartRepo = connectCartRepo();
  var result = cartRepo.query({
    start: 0,
    count: -1,
    query:
      "(email = '" +
      email +
      "' or userRelation = '" +
      id +
      "') and status in ('failed', 'paid', 'pending', 'shipped')"
  });
  if (count) {
    return result.total;
  }
  let carts = [];
  for (var i = 0; i < result.hits.length; i++) {
    let tempCart = cartRepo.get(result.hits[i].id);
    if (tempCart) carts.push(getCart(tempCart._id));
  }
  return carts;
}

function getCartByQr(qr: number): Cart | null {
  let cartRepo = connectCartRepo();
  let result = cartRepo.query({
    start: 0,
    count: 1,
    query: "items.itemsIds.id=" + qr
  });

  if (result.total === 0) return null;
  let cart = getCart(result.hits[0].id);
  cart.items = utils.data.forceArray(cart.items);
  if (!cart.items) return cart;

  for (let i = 0; i < cart.items.length; i++) {
    let item = cart.items[i];
    if (!isCartItemProcessed(item)) continue;
    let itemIds: Array<CartItemId> = utils.data.forceArray(
      cart.items[i].itemsIds
    );
    if (!itemIds) continue;

    for (let j = 0; j < itemIds.length; j++) {
      if (itemIds[j] && itemIds[j].id == qr) {
        let product = contentLib.get<Product>({
          key: item._id
        });
        cart.qrActivated = itemIds[j].activated ? true : false;
        cart.currentFriendlyId = itemIds[j].friendlyId;
        if (product) {
          cart.legendary = product.data.ticketType === "kostiConnectTurbo";
          cart.currentTicketType = product.data.ticketType;
        }
      }
    }
  }
  return cart;
}

function getCreatedCarts(params: getCreatedCartsRequest) {
  var cartRepo = connectCartRepo();
  var result = [];
  var query = "_ts > '2019-03-26T07:24:47.393Z'";
  if (params.status) {
    let statuses = utils.data.forceArray(params.status);
    query += " and status IN ('" + statuses.join("','") + "')";
  } else {
    query +=
      " and status in ('failed', 'paid', 'pending', 'created', 'shipped')";
  }
  if (params.country) {
    query += " and country = '" + params.country + "'";
  }
  if (params.search) {
    query +=
      " and (fulltext('_allText', '\"" +
      params.search +
      "\"', 'OR') or ngram('_allText', '\"" +
      params.search +
      "\"', 'OR')" +
      " or (userId='" +
      params.search +
      "' or userId=" +
      params.search +
      "))";
    if (parseInt(params.search) !== NaN && parseInt(params.search)) {
      query += " OR items.itemsIds.id=" + params.search;
    }
  }
  if (params.start) {
    let date = new Date(params.start).toISOString();
    query += " and transactionDate > dateTime('" + date + "')";
  }
  if (params.end) {
    let date = new Date(params.end).toISOString();
    query += " and transactionDate < dateTime('" + date + "')";
  }
  if (params.product) {
    query += " and items.id = '" + params.product + "'";
  }
  if (params.paymentMethod) {
    query += " and paymentMethod = '" + params.paymentMethod + "'";
  }
  if (params.userId) {
    query +=
      " and (userId='" + params.userId + "' or userId=" + params.userId + ")";
  }
  if (params.statistics) {
    query +=
      " and email NOT IN ('maxskywalker94@gmail.com', 'demura.vi@gmail.com', 'vecherniy.dnd@gmail.com', 'yarynaholod@gmail.com', 'y.holod@astoundcommerce.com')";
  }
  log.info(query);
  params.page = params.page ? params.page : 1;
  var carts = cartRepo.query({
    start: (params.page - 1) * 10,
    query: query,
    sort: params.sort ? params.sort : "_ts desc",
    count: params.count ? params.count : 30,
    filters: params.filters ? params.filters : undefined
  });
  for (var i = 0; i < carts.hits.length; i++) {
    result.push(getCart(carts.hits[i].id));
  }
  return { hits: result, total: carts.total };
}

interface getCreatedCartsRequest {
  status?: string | string[];
  country?: string;
  search?: string;
  start?: string;
  end?: string;
  product?: string;
  paymentMethod?: string;
  userId?: string;
  statistics?: string;
  page?: number;
  sort?: string;
  count?: number;
  filters?: BasicFilters | BooleanFilter;
}
