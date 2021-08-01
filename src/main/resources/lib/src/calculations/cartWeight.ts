import { Product } from "../../../site/content-types/product/product";
import { CartItem, CartItemProcessed } from "../../../types/cart";
const utils = __non_webpack_require__("/lib/util");
const contentLib = __non_webpack_require__("/lib/xp/content");

export { caclculateCartWeight };

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
  let result = 0;
  let includesPoster = false;
  for (let i = 0; i < items.length; i++) {
    let item = contentLib.get<Product>({ key: items[i].id });
    if (item && item.data && item.data.weight) {
      if (item.data.type === "poster" && !includesPoster) {
        result += item.data.weight;
        includesPoster = true;
      } else if (item.data.type !== "poster") {
        result += item.data.weight * items[i].amount;
      }
    }
  }
  return result;
}
