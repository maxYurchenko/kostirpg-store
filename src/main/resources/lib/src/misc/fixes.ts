import { connectCartRepo } from "../helpers/repo";
import { getCart } from "../getCart";
import { setUserDetails } from "../modifications/setUserDetails";
import { savePrices } from "../modifications/savePrices";
import { generateItemsIds } from "../modifications/itemIds";
import { Cart } from "../../../types/cart";
const utils = __non_webpack_require__("/lib/util");

export { fixCartPrice, fixItemIds, fixCartDate };

function fixCartPrice(force?: boolean) {
  let filters;
  if (!force) {
    filters = {
      notExists: {
        field: "price"
      }
    };
  }
  let cartRepo = connectCartRepo();
  let result = cartRepo.query({
    start: 0,
    count: -1,
    query: "status in ('failed', 'paid', 'pending', 'shipped')",
    filters: filters
  });
  utils.log("Fixing cart price for " + result.total + " items.");
  for (let i = 0; i < result.hits.length; i++) {
    let cart = getCart(result.hits[i].id);
    setUserDetails(cart._id, { price: cart.price });
  }
  let temp = cartRepo.query({
    start: 0,
    count: -1,
    query: "status in ('failed', 'paid', 'pending', 'shipped')",
    filters: {
      notExists: {
        field: "items.transactionPrice"
      }
    }
  });
  utils.log("Fixing items price for " + temp.total + " items.");
  for (let i = 0; i < temp.hits.length; i++) {
    let cart = getCart(result.hits[i].id);
    savePrices(cart._id);
  }
}

function fixItemIds() {
  var cartRepo = connectCartRepo();
  var result = cartRepo.query({
    start: 0,
    count: -1,
    query: "status in ('failed', 'paid', 'pending', 'shipped')",
    filters: {
      notExists: {
        field: "items.itemsIds.id"
      }
    }
  });
  utils.log("Fixing cart ids for " + result.total + " items.");
  for (var i = 0; i < result.hits.length; i++) {
    generateItemsIds(result.hits[i].id);
  }
}

function fixCartDate() {
  var cartRepo = connectCartRepo();
  var result = cartRepo.query({
    start: 0,
    count: -1,
    query: "status in ('failed', 'paid', 'pending', 'shipped')"
  });
  utils.log("Fixing cart transaction date for " + result.total + " items.");
  for (var i = 0; i < result.hits.length; i++) {
    const cart: Cart = cartRepo.get(result.hits[i].id);
    utils.log("Fixing cart id " + cart._id);
    let transactionDate: Date;
    if (cart.transactionDate) {
      transactionDate = new Date(cart.transactionDate);
    } else {
      transactionDate = new Date(cart._ts);
    }
    setUserDetails(cart._id, {
      transactionDate: transactionDate
    });
  }
  utils.log("Finished");
}
