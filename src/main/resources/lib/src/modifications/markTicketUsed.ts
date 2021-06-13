const utils = __non_webpack_require__("/lib/util");

import { Cart } from "../../../types/cart";
import { connectCartRepo } from "../helpers/repo";

export { markTicketUsed };

function markTicketUsed(qr: number) {
  var cartRepo = connectCartRepo();
  var result = cartRepo.query({
    start: 0,
    count: 1,
    query:
      "fulltext('items.itemsIds.id', '\"" +
      qr +
      "\"', 'OR') or ngram('items.itemsIds.id', '\"" +
      qr +
      "\"', 'OR') or items.itemsIds.id=" +
      qr
  });
  if (result.total === 0) return;
  cartRepo.modify({
    key: result.hits[0].id,
    editor: editor
  });

  function editor(node: Cart) {
    if (!node.items) return node;
    node.items = utils.data.forceArray(node.items);
    if (!node.items) return node;
    for (var i = 0; i < node.items.length; i++) {
      let item = node.items[i];
      if (!item.itemsIds) continue;
      item.itemsIds = utils.data.forceArray(item.itemsIds);
      if (!item.itemsIds) continue;

      for (var j = 0; j < item.itemsIds.length; j++) {
        if (item.itemsIds[j].id == qr) {
          item.itemsIds[j].activated = true;
          node.items[i] = item;
          return node;
        }
      }
    }
    return node;
  }
}
