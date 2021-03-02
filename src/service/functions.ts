import { createHash } from "crypto";

import { INotifyFields, TSignFields } from "../types/index";

export const sign = (fields: TSignFields, key: string) => {
  const acc = [
    fields.wsb_seed,
    fields.wsb_storeid,
    fields.wsb_order_num,
    fields.wsb_test,
    fields.wsb_currency_id,
    fields.wsb_total,
    key,
  ].join("");

  switch (fields.wsb_version) {
    case 1:
      return createHash("md5").update(acc).digest("hex");
    case 2:
      return createHash("sha1").update(acc).digest("hex");
    default:
      return "";
  }
};

export const checkSign = (fields: INotifyFields, key: string) => {
  const acc = [
    fields.batch_timestamp,
    fields.currency_id,
    fields.amount,
    fields.payment_method,
    fields.order_id,
    fields.site_order_id,
    fields.transaction_id,
    fields.payment_type,
    fields.rrn,
    key,
  ].join("");

  const sign = createHash("md5").update(acc).digest("hex");

  console.log(fields.wsb_signature, sign, fields.wsb_signature === sign);
  return fields.wsb_signature === sign;
};
