const utils = __non_webpack_require__("/lib/util");
const contentLib = __non_webpack_require__("/lib/xp/content");

import { Cart } from "../../../types/cart";
import { getCart } from "../getCart";
import { connectCartRepo } from "../helpers/repo";
import { Product } from "../../../site/content-types/product/product";

export { modify };

function modify(params: modifyCartRequest) {
  let cart = getCart(params.cartId);
  if (!validateCartStatusAvailableForModify(cart) && !params.adminUser) {
    cart = getCart();
  }
  const cartRepo = connectCartRepo();
  var item = contentLib.get<Product>({ key: params.itemId });
  if (item && item.data && item.data.generateIds) {
    var generateIds = item.data.generateIds;
  }
  cart = cartRepo.modify({
    key: cart._id,
    editor: editor
  });
  return getCart(cart._id);

  function editor(node: Cart) {
    if (node.items) {
      node.items = utils.data.forceArray(node.items);
      if (!node.items) {
        return node;
      }
      for (var i = 0; i < node.items.length; i++) {
        if (
          node.items[i].id == params.itemId &&
          node.items[i].itemSize == params.size
        ) {
          if (params.force) {
            node.items[i].amount = params.amount;
          } else {
            node.items[i].amount = node.items[i].amount + params.amount;
          }
          node.items[i].generateIds = generateIds
            ? generateIds
            : node.items[i].generateIds;
          if (params.amount < 1) {
            delete node.items[i];
          }
          return node;
        }
      }
      node.items.push({
        id: params.itemId,
        amount: params.amount,
        itemSize: params.size,
        generateIds: generateIds ? generateIds : undefined
      });
      return node;
    } else {
      node.items = [
        {
          id: params.itemId,
          amount: params.amount,
          itemSize: params.size,
          generateIds: generateIds ? generateIds : undefined
        }
      ];
      return node;
    }
  }
}

function validateCartStatusAvailableForModify(cart: Cart) {
  const statuses = ["failed", "paid", "pending"];
  if (!cart.status || statuses.indexOf(cart.status) === -1) return true;
  return false;
}
interface modifyCartRequest {
  cartId: string;
  itemId: string;
  amount: number;
  size?: string;
  force?: boolean;
  adminUser: boolean;
}
