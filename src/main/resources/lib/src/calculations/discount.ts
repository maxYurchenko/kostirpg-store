import { Cart, CartDiscount, Code } from "../../../types/cart";
import { getPromosArray } from "../../promo/promoLib";

export { checkCartDiscount, fixDiscount };

function checkCartDiscount(cart: Cart, itemsTotal: number): CartDiscount {
  let discount = {
    shipping: 0,
    products: 0,
    shippingProducts: 0,
    total: 0
  };
  if (!cart.promos) {
    return {
      discount: discount
    };
  }
  let promos: any = getPromosArray(cart.promos);
  let cartCodes: Array<Code> = [];
  for (let i = 0; i < promos.length; i++) {
    if (!promos[i]) {
      continue;
    }
    let codeDiscount = 0;
    if (promos[i].data.type == "percent") {
      codeDiscount += itemsTotal * (promos[i].data.discount / 100);
    } else {
      codeDiscount += promos[i].data.discount;
    }
    if (promos[i].data.applyTo === "shipping") {
      discount.shipping += codeDiscount;
    } else {
      discount.products += codeDiscount;
    }
    discount.total += codeDiscount;
    cartCodes.push({
      displayName: promos[i].displayName,
      type: promos[i].data.type,
      discount: promos[i].data.discount,
      code: promos[i].data.currentCode
    });
  }
  return {
    discount: discount,
    codes: cartCodes
  };
}

function fixDiscount(cart: any) {
  if (!isNaN(cart.price?.discount.discount)) {
    cart.price.discount.discount = {
      shipping: 0,
      products: 0,
      shippingProducts: 0,
      total: cart.price.discount.discount
    };
  }
  return cart.price.discount;
}
