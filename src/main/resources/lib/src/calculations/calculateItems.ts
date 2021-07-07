import { CartItem, CartItemProcessed } from "../../../types/cart";
const utils = __non_webpack_require__("/lib/util");

export { calculateCartItems };

function calculateCartItems(
  items: Array<CartItemProcessed | CartItem>
): number {
  if (!items) {
    return 0;
  }
  items = utils.data.forceArray(items);
  let result = 0;
  for (let i = 0; i < items.length; i++) {
    result += items[i].amount;
  }
  return result;
}
