import { Content } from "enonic-types/content";
import { Promo } from "../../site/content-types/promo/promo";

const utils = __non_webpack_require__("/lib/util");
const contentLib = __non_webpack_require__("/lib/xp/content");

export { getPromosArray };

function getPromosArray(codes: string[]) {
  var result = [];
  codes = utils.data.forceArray(codes);
  for (var i = 0; i < codes.length; i++) {
    let promo = getPromoByCode(codes[i]);
    if (!promo) continue;
    result.push(promo);
  }
  return result;
}

function getPromoByCode(code: string): Content<Promo> | null {
  var query = "(data.code = '" + code + "' AND data.amount > 0)";
  query +=
    " OR (data.codeType._selected = 'same' AND data.codeType.same.code = '" +
    code +
    "')";
  query +=
    " OR (data.codeType._selected = 'unique' AND data.codeType.unique.unique.code = '" +
    code +
    "')";
  var result: any = contentLib.query({
    start: 0,
    count: 1,
    query: query
  });
  if (result.hits[0] && isPromoValid(result.hits[0], code)) {
    result.hits[0].data.currentCode = code;
    return result.hits[0];
  }
  return null;
}

function isPromoValid(promo: Content<Promo>, code: string) {
  if (
    !(
      promo &&
      promo.data &&
      promo.data.codeType &&
      promo.data.codeType._selected
    )
  ) {
    return false;
  }
  var promoData = promo.data.codeType;
  if (promoData._selected === "unique") {
    if (promoData.unique.unique) {
      var codes = utils.data.forceArray(promoData.unique.unique);
      for (var i = 0; i < codes.length; i++) {
        if (codes[i].code === code && codes[i].used !== true) {
          return true;
        }
      }
    }
  } else if (promoData._selected === "same" && promoData.same.amount) {
    if (promoData.same.amount > 0) {
      return true;
    }
  }
  return false;
}
