import { Cart } from "../../../types/cart";
const utils = __non_webpack_require__("/lib/util");
const contentLib = __non_webpack_require__("/lib/xp/content");
const portal = __non_webpack_require__("/lib/xp/portal");

export { getShippingPrice };

function getShippingPrice(cart: Cart): number {
  var site: any = portal.getSiteConfig();
  var shipping: any = contentLib.get({ key: site.shipping });
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
