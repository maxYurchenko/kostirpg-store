const utils = __non_webpack_require__("/lib/util");

import { Cart } from "../../../types/cart";
import { connectCartRepo } from "../helpers/repo";
import { getCart } from "../getCart";

export { addPromo, removePromo };

function addPromo(code: string, cartId: string) {
  var cartRepo = connectCartRepo();
  var result = cartRepo.modify({
    key: cartId,
    editor: function (node: Cart) {
      if (!node.promos) {
        node.promos = [];
      }
      node.promos = utils.data.forceArray(node.promos);
      if (node.promos.indexOf(code) == -1) {
        node.promos.push(code);
      }
      return node;
    }
  });
  return getCart(result._id);
}

function removePromo(code: string, cartId: string) {
  var cartRepo = connectCartRepo();
  var result = cartRepo.modify({
    key: cartId,
    editor: editor
  });
  return getCart(result._id);
  function editor(node: Cart) {
    if (!node.promos) {
      return node;
    }
    node.promos = utils.data.forceArray(node.promos);
    node.promos.splice(node.promos.indexOf(code), 1);
    return node;
  }
}
