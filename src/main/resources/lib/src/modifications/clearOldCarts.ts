import { connectCartRepo } from "../helpers/repo";

const utils = __non_webpack_require__("/lib/util");

export { clearOldCarts };

function clearOldCarts() {
  utils.log("starting to clear old carts");

  let cartRepo = connectCartRepo(),
    total = 1,
    amount = 1000,
    date = new Date();
  date.setDate(date.getDate() - 90);
  utils.log("removal date is " + date);
  while (total > 0) {
    let carts = cartRepo.query({
      query:
        "_ts < dateTime('" +
        date.toISOString() +
        "') and status NOT IN ('pending', 'created', 'failed', 'paid')",
      count: amount,
      start: 0
    });

    utils.log(
      "clearing " + carts.count + " of " + carts.total + " outdated carts"
    );

    carts.hits.forEach((cart) => {
      cartRepo.delete(cart.id);
    });
    total = carts.total;
  }

  utils.log("finished clearing old carts");
}
