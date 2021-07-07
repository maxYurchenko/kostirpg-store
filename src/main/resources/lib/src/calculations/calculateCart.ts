import { Product } from "../../../site/content-types/product/product";
import { CartPrice, Cart } from "../../../types/cart";
import { checkCartDiscount } from "./discount";
const utils = __non_webpack_require__("/lib/util");
const contentLib = __non_webpack_require__("/lib/xp/content");

import { getShippingPrice } from "./shipping";

export { calculateCart };

function calculateCart(cart: Cart): CartPrice {
  if (!cart || !cart.items) {
    return {
      items: "0",
      shipping: "0",
      total: "0",
      currency: "UAH",
      discount: { discount: 0, codes: [] },
      totalDiscount: "0"
    };
  }
  var items = utils.data.forceArray(cart.items);
  if (items == []) {
    return {
      items: "0",
      shipping: "0",
      total: "0",
      currency: "UAH",
      discount: { discount: 0, codes: [] },
      totalDiscount: "0"
    };
  }
  var result = 0;
  for (var i = 0; i < items.length; i++) {
    var item = contentLib.get<Product>({ key: items[i]._id });
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
    items: result.toFixed(),
    shipping: shipping.toFixed(),
    discount: discount,
    totalDiscount: Math.max(result + shipping - discount.discount, 0).toFixed(),
    total: (result + shipping).toFixed(),
    currency: "UAH"
  };
}
