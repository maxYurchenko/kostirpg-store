import { Product } from "../../site/content-types/product/product";
import {
  Cart,
  CartItem,
  CartItemProcessed,
  CartItemId,
  CartItemIdProcessed
} from "../../types/cart";
import { getImage } from "./helpers/image";
const utils = __non_webpack_require__("/lib/util");
const contentLib = __non_webpack_require__("/lib/xp/content");

export { getCartItems };

function getCartItems(cart: Cart): Array<CartItemProcessed> {
  if (!cart.items) return [];
  let items: Array<CartItem> = utils.data.forceArray(cart.items);
  let result: Array<CartItemProcessed> = [];
  for (let i = 0; i < items.length; i++) {
    let item = contentLib.get<Product>({ key: items[i].id });
    if (item && item.data && typeof item.data.inventory === "undefined") {
      item.data.inventory = 99999999;
    }
    if (items[i].itemsIds) {
      if (!items[i].itemsIds) continue;
      items[i].itemsIds = utils.data.forceArray(items[i].itemsIds);
      let temp = items[i].itemsIds;
      if (!temp) continue;
      let item: Array<CartItemId> = temp;

      for (let n = 0; n < item.length; n++) {
        let currId = item[n];
        if (!currId || !currId.id) continue;
        if (currId.id) {
          item[n].id = currId.id;
        }
      }
      items[i].itemsIds = item;
    }
    let itemIds: CartItemIdProcessed[] = utils.data.forceArray(
      items[i].itemsIds
    );
    for (let j = 0; j < itemIds.length; j++) {
      if (itemIds[i].id) itemIds[i].id = Number(itemIds[i].id).toFixed();
      if (itemIds[i].friendlyId)
        itemIds[i].friendlyId = Number(itemIds[i].id).toFixed();
    }
    if (item && item.data) {
      result.push({
        id: item._id,
        _id: item._id,
        imageCart: getImage(item.data.mainImage, "block(140, 140)"),
        imageSummary: getImage(item.data.mainImage, "block(90, 90)"),
        displayName: item.displayName,
        stock:
          (item.data.inventory ? item.data.inventory : 0) >= items[i].amount,
        preorder: item.data.preorder,
        price: item.data.price,
        finalPrice: item.data.finalPrice,
        amount: items[i].amount,
        amountString: items[i].amount.toFixed(),
        itemSize: items[i].itemSize,
        digital: item.data.digital ? true : false,
        ticketType: item.data.ticketType,
        productType: item.data.type,
        transactionPrice: items[i].transactionPrice
          ? items[i].transactionPrice
          : undefined,

        itemSizeStock: checkItemSizeStock(
          items[i].amount,
          item._id,
          items[i].itemSize
        ),
        itemsIdsProcessed: itemIds
      });
    }
  }
  return result;
}

function checkItemSizeStock(amount: number, id: string, size?: string) {
  let item = contentLib.get<Product>({ key: id });
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
