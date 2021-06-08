import { Content } from "enonic-types/content";
import { Product } from "../../../site/content-types/product/product";
import { CartItemProcessed } from "../../../types/cart";
const utils = __non_webpack_require__("/lib/util");
const contentLib = __non_webpack_require__("/lib/xp/content");

export { modifyInventory };

function modifyInventory(items: Array<CartItemProcessed>) {
  items = utils.data.forceArray(items);
  for (var i = 0; i < items.length; i++) {
    if (items[i].id && !items[i]._id) {
      items[i]._id = items[i].id;
    }
    contentLib.modify({
      key: items[i]._id,
      requireValid: false,
      editor: function (node: Content<Product>) {
        return editor(node, items[i]);
      }
    });
    contentLib.publish({
      keys: [items[i]._id],
      sourceBranch: "master",
      targetBranch: "draft"
    });
  }
  function editor(node: Content<Product>, item: CartItemProcessed) {
    if (typeof node.data.inventory !== "undefined" && node.data.inventory > 0) {
      node.data.inventory = node.data.inventory - item.amount;
    }
    if (!node.data.sizes) return node;
    node.data.sizes = utils.data.forceArray(node.data.sizes);
    if (!node.data.sizes) return node;

    for (var j = 0; j < node.data.sizes.length; j++) {
      let size = node.data.sizes[j];
      if (size.amount && size.title == item.itemSize) {
        node.data.sizes[j].amount = size.amount - item.amount;
        break;
      }
    }

    return node;
  }
}
