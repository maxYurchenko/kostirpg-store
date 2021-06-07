import {
  Cart,
  CartDates,
  CartDiscount,
  CartItem,
  CartItemProcessed,
  CartPrice,
  isCartItemProcessed
} from "../../../types/cart";

const nodeLib = __non_webpack_require__("/lib/xp/node");
const utils = __non_webpack_require__("/lib/util");

export { getCart };

function getCart(cartId: string) {
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
  cart = getCartItems(cart);
  if (!cart.items) {
    return cart;
  }
  cart.itemsNum = calculateCartItems(cart.items);
  cart.itemsWeight = caclculateCartWeight(cart.items);
  cart.dates = getCartDates(cart);
  if (!cart.price) {
    cart.price = calculateCart(cart);
  }
  cart.stock = checkCartStock(cart.items);
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

function connectCartRepo() {
  return nodeLib.connect({
    repoId: "cart",
    branch: "master"
  });
}

function getCartItems(cart: Cart): Cart {
  let items = utils.data.forceArray(cart.items);
  if (items == []) {
    return cart;
  }
  let result: Array<CartItemProcessed> = [];
  for (let i = 0; i < items.length; i++) {
    let item = contentLib.get({ key: items[i].id });
    if (item && item.data && typeof item.data.inventory === "undefined") {
      item.data.inventory = 99999999;
    }
    if (items[i].itemsIds) {
      items[i].itemsIds = utils.data.forceArray(items[i].itemsIds);
      for (let n = 0; n < items[i].itemsIds.length; n++) {
        if (items[i].itemsIds[n] && items[i].itemsIds[n].id) {
          if (parseInt(items[i].itemsIds[n].id)) {
            items[i].itemsIds[n].id = parseInt(
              items[i].itemsIds[n].id
            ).toFixed();
          }
        }
      }
    }
    if (item && item.data) {
      result.push({
        id: item._id,
        _id: item._id,
        imageCart: norseUtils.getImage(
          item.data.mainImage,
          "block(140, 140)",
          false,
          "absolute"
        ),
        imageSummary: norseUtils.getImage(
          item.data.mainImage,
          "block(90, 90)",
          false,
          "absolute"
        ),
        displayName: item.displayName,
        stock: item.data.inventory >= parseInt(items[i].amount),
        preorder: item.data.preorder,
        price: item.data.price,
        finalPrice: item.data.finalPrice,
        amount: items[i].amount,
        itemSize: items[i].itemSize,
        digital: item.data.digital ? true : false,
        ticketType: item.data.ticketType ? item.data.ticketType : false,
        productType: item.data.type,
        transactionPrice: items[i].transactionPrice
          ? items[i].transactionPrice
          : undefined,

        itemSizeStock: checkItemSizeStock(
          items[i].itemSize,
          parseInt(items[i].amount),
          item._id
        ),
        itemsIds: utils.data.forceArray(items[i].itemsIds)
      });
    }
  }
  cart.items = result;
  return cart;
}

function checkCartStock(items: Array<CartItemProcessed | CartItem>): boolean {
  for (let i = 0; i < items.length; i++) {
    let item = items[i];
    if (isCartItemProcessed(item) && (!item.stock || !item.itemSizeStock)) {
      return false;
    }
  }
  return true;
}

function checkItemSizeStock(size: string, amount: number, id: string) {
  let item = contentLib.get({ key: id });
  if (item && item.data && item.data.sizes) {
    let sizes = utils.data.forceArray(item.data.sizes);
    for (let i = 0; i < sizes.length; i++) {
      if (sizes[i].title == size) {
        if (amount <= parseInt(sizes[i].amount)) {
          return true;
          break;
        }
      }
    }
  } else {
    return true;
  }
  return false;
}

function caclculateCartWeight(
  items: Array<CartItemProcessed | CartItem>
): number {
  if (!items) {
    return 0;
  }
  items = utils.data.forceArray(items);
  if (items == []) {
    return 0;
  }
  var result = 0;
  for (var i = 0; i < items.length; i++) {
    var item = contentLib.get({ key: items[i].id });
    if (item && item.data && item.data.weight) {
      result += parseFloat(item.data.weight) * items[i].amount;
    }
  }
  return result;
}

function calculateCartItems(
  items: Array<CartItemProcessed | CartItem>
): number {
  if (!items) {
    return 0;
  }
  items = utils.data.forceArray(items);
  if (!items) {
    return 0;
  }
  var result = 0;
  for (var i = 0; i < items.length; i++) {
    result += items[i].amount;
  }
  return result;
}

function getCartDates(cart: Cart): CartDates {
  return {
    createdDate: moment(cart.createdTime).format("DD.MM.YYYY"),
    createdTime: moment(cart.createdTime).format("DD.MM.YYYY HH:mm"),
    transactionDate: moment(cart.transactionDate).format("DD.MM.YYYY"),
    transactionTime: moment(cart.transactionDate).format("DD.MM.YYYY HH:mm")
  };
}

function calculateCart(cart: Cart): CartPrice {
  if (!cart || !cart.items) {
    return {
      items: 0,
      shipping: 0,
      total: 0,
      currency: "UAH",
      discount: { discount: 0, codes: [] },
      totalDiscount: 0
    };
  }
  var items = utils.data.forceArray(cart.items);
  if (items == []) {
    return {
      items: 0,
      shipping: 0,
      total: 0,
      currency: "UAH",
      discount: { discount: 0, codes: [] },
      totalDiscount: 0
    };
  }
  var result = 0;
  for (var i = 0; i < items.length; i++) {
    var item = contentLib.get({ key: items[i]._id });
    if (item && item.data && item.data.price) {
      result += item.data.price * parseInt(items[i].amount);
    }
  }
  if (cart.shippingPrice) {
    var shipping = parseInt(cart.shippingPrice);
  } else {
    var shipping = getShippingPrice(cart);
  }
  var discount = checkCartDiscount(cart, result);
  return {
    items: result,
    shipping: shipping,
    discount: discount,
    totalDiscount: Math.max(result + shipping - discount.discount, 0),
    total: result + shipping,
    currency: "UAH"
  };
}

function getShippingPrice(cart: Cart): number {
  var site = sharedLib.getSiteConfig();
  var shipping = contentLib.get({ key: site.shipping });
  for (var i = 0; i < shipping.data.shipping.length; i++) {
    if (shipping.data.shipping[i].country.indexOf(cart.country) != -1) {
      var shippingMethods = utils.data.forceArray(
        shipping.data.shipping[i].methods
      );
      break;
    }
  }
  if (!shippingMethods) {
    return 0;
  }
  for (var i = 0; i < shippingMethods.length; i++) {
    if (shippingMethods[i].id == cart.shipping) {
      var method = utils.data.forceArray(shippingMethods[i].priceList);
      break;
    }
  }
  if (!method) {
    return 0;
  }
  for (var i = 0; i < method.length; i++) {
    if (cart.itemsWeight < parseFloat(method[i].weight)) {
      return parseInt(method[i].price);
    }
  }
  return method[method.length - 1].price;
}

function checkCartDiscount(cart: Cart, itemsTotal: number): CartDiscount {
  if (!cart.promos) {
    return {
      discount: 0,
      codes: []
    };
  }
  var discount = 0;
  var promosLib = require("promosLib");
  var promos = promosLib.getPromosArray(cart.promos);
  var cartCodes = [];
  for (var i = 0; i < promos.length; i++) {
    if (!promos[i] || !promos[i].data) {
      continue;
    }
    if (promos[i].data.type == "percent") {
      discount += itemsTotal * (promos[i].data.discount / 100);
    } else {
      discount += parseInt(promos[i].data.discount);
    }
    cartCodes.push({
      displayName: promos[i].displayName,
      type: promos[i].data.type,
      discount: promos[i].data.discount,
      code: promos[i].code
    });
  }
  return {
    discount: discount,
    codes: cartCodes
  };
}
