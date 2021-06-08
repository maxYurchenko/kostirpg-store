import { Cart } from "../../../types/cart";
import { connectCartRepo } from "../helpers/repo";
import { getCart } from "../getCart";
import * as contextLib from "../helpers/contextLib";
import { Product } from "../../../site/content-types/product/product";

const utils = __non_webpack_require__("/lib/util");
const contentLib = __non_webpack_require__("/lib/xp/content");

export { savePrices };

function savePrices(cartId: string) {
  let cartRepo = connectCartRepo();
  let cart = getCart(cartId);
  cartRepo.modify({
    key: cartId,
    editor: editor
  });

  function editor(node: Cart) {
    node.transactionPrice = cart.price;
    if (!node.items) return node;
    node.items = utils.data.forceArray(node.items);
    if (!node.items) return node;

    for (let i = 0; i < node.items.length; i++) {
      let item = node.items[i];
      let product = contextLib.runInDefault(function () {
        return contentLib.get<Product>({ key: item.id });
      });
      if (product && product.data && product.data.price) {
        node.items[i].transactionPrice = product.data.price;
      }
    }
    return node;
  }
}
