import { CartUtils } from "../../../types/cart";

const nodeLib = __non_webpack_require__("/lib/xp/node");

export { connectCartRepo, getNextId, getCartUtils, modifyCartUtils };

function connectCartRepo() {
  return nodeLib.connect({
    repoId: "cart",
    branch: "master"
  });
}

function getNextId(): number {
  var cartRepo = connectCartRepo();
  var result = cartRepo.query({
    start: 0,
    count: 1,
    query: ""
  });
  return result.total + 1 + new Date().getUTCMilliseconds();
}

function getCartUtils(): CartUtils {
  var cartRepo = connectCartRepo();
  var utils = cartRepo.query({
    query: "_name = 'utils'"
  });
  if (utils.hits[0]) {
    return cartRepo.get(utils.hits[0].id);
  } else {
    return cartRepo.create({
      _name: "utils",
      ticketCount: 0
    });
  }
}

function modifyCartUtils(ticketCount: number) {
  var cartRepo = connectCartRepo();
  var utils = getCartUtils();
  cartRepo.modify({
    key: utils._id,
    editor: function (node: any) {
      node.ticketCount = ticketCount ? ticketCount : node.ticketCount;
      return node;
    }
  });
}
