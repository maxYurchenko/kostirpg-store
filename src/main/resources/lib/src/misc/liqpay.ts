import { connectCartRepo } from "../helpers/repo";

export { getLiqpayPendingCarts };

function getLiqpayPendingCarts() {
  var cartRepo = connectCartRepo();
  var result = cartRepo.query({
    start: 0,
    count: -1,
    query:
      "paymentMethod = 'liqpay' and status in ('pending', 'created') and _ts > '2021-04-01T00:00:00.000Z'"
  });
  var carts = [];
  for (var i = 0; i < result.hits.length; i++) {
    carts.push(cartRepo.get(result.hits[i].id));
  }
  return carts;
}
