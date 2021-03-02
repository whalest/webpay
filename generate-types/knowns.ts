import { IFields, ITableInputs } from "./fields";

export const eachItemHook = (fields: IFields, table: ITableInputs) => {
  let result: IFields = fields;

  // all numbers
  if (
    [
      "wsb_version",
      "wsb_test",
      "wsb_tax",
      "wsb_shipping_price",
      "wsb_discount_price",
      "wsb_total",
    ].includes(fields.name)
  ) {
    result.type = "number";

    switch (fields.name) {
      case "wsb_version":
        result.default = 2;
        break;
      case "wsb_test":
        result.default = 1;
        break;
      default:
        result.default = 0;
        break;
    }
  }

  // by tables
  if (table.id === "main") {
    if (fields.name === "wsb_language_id") {
      result.type = `TLanguage`;
      result.default = `"russian"`;
    }

    if (fields.name === "wsb_currency_id") {
      result.type = `TCurrency`;
      result.default = `"BYN"`;
    }
  }

  if (table.id === "cart") {
    if (fields.name === "wsb_invoice_item_name[{n}]") {
      result.name = "wsb_invoice_item_name";
      result.type = "string[]";
      result.default = "[]";
    }

    if (fields.name === "wsb_invoice_item_quantity[{n}]") {
      result.name = "wsb_invoice_item_quantity";
      result.type = "number[]";
      result.default = "[]";
    }

    if (fields.name === "wsb_invoice_item_price[{n}]") {
      result.name = "wsb_invoice_item_price";
      result.type = "number[]";
      result.default = "[]";
    }
  }

  return result;
};
