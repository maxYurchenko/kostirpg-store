import { Cart, CartDiscount } from "../../../types/cart";
import { getPromosArray } from "../../promo/promoLib";

export { checkCartDiscount };

function checkCartDiscount(cart: Cart, itemsTotal: number): CartDiscount {
  if (!cart.promos) {
    return {
      discount: 0
    };
  }
  let discount = 0;
  let promos = getPromosArray(cart.promos);
  let cartCodes = [];
  for (let i = 0; i < promos.length; i++) {
    if (!promos[i]) {
      continue;
    }
    if (promos[i].data.type == "percent") {
      discount += itemsTotal * (promos[i].data.discount / 100);
    } else {
      discount += promos[i].data.discount;
    }
    cartCodes.push({
      displayName: promos[i].displayName,
      type: promos[i].data.type,
      discount: promos[i].data.discount
    });
  }
  return {
    discount: discount
  };
}
