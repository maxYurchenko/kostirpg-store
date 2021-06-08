import {
  CartItem,
  CartItemProcessed,
  isCartItemProcessed
} from "../../../types/cart";

export { checkCartStock };

function checkCartStock(items: Array<CartItemProcessed | CartItem>): boolean {
  for (let i = 0; i < items.length; i++) {
    let item = items[i];
    if (isCartItemProcessed(item) && (!item.stock || !item.itemSizeStock)) {
      return false;
    }
  }
  return true;
}
