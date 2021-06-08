import { Cart } from "../../../types/cart";
import {
  connectCartRepo,
  getCartUtils,
  modifyCartUtils
} from "../helpers/repo";
import { getCart } from "../getCart";

const utils = __non_webpack_require__("/lib/util");
const contentLib = __non_webpack_require__("/lib/xp/content");
import * as contextLib from "../helpers/contextLib";
import { Product } from "../../../site/content-types/product/product";
import { createNiceNumericHash } from "../helpers/hash";

export { generateItemsIds };

function generateItemsIds(cartId: string) {
  let cartRepo = connectCartRepo();
  let cartUtils = getCartUtils();
  cartRepo.modify({
    key: cartId,
    editor: editor
  });
  modifyCartUtils(cartUtils.ticketCount);
  return getCart(cartId);

  function editor(node: Cart) {
    if (!node || !node.items) return node;
    node.items = utils.data.forceArray(node.items);
    if (!node.items) return node;

    for (let i = 0; i < node.items.length; i++) {
      let item = node.items[i];
      item.itemsIds = [];
      let product = contextLib.runInDefault(function () {
        return contentLib.get<Product>({ key: item.id });
      });
      if (product.data.type !== "ticket") {
        continue;
      }
      let idsCount = item.amount;
      if (item.generateIds) {
        idsCount = idsCount * item.generateIds;
      }
      for (let j = 0; j < idsCount; j++) {
        cartUtils.ticketCount++;
        item.itemsIds.push({
          id: createNiceNumericHash(
            node.name +
              " " +
              node.surname +
              " " +
              node.items[i].id +
              " " +
              new Date().getTime() +
              " " +
              j +
              " " +
              i
          ),
          activated: false,
          friendlyId: cartUtils.ticketCount
        });
      }
      node.items[i] = item;
    }

    return node;
  }
}
