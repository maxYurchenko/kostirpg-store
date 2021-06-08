import { Cart, CartDates } from "../../../types/cart";
const moment = require("../helpers/moment");

export { getCartDates };

function getCartDates(cart: Cart): CartDates {
  return {
    createdDate: moment(cart.createdTime).format("DD.MM.YYYY"),
    createdTime: moment(cart.createdTime).format("DD.MM.YYYY HH:mm"),
    transactionDate: moment(cart.transactionDate).format("DD.MM.YYYY"),
    transactionTime: moment(cart.transactionDate).format("DD.MM.YYYY HH:mm")
  };
}
