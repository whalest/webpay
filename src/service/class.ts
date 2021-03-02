import {
  _IFormFields,
  IFieldsItem,
  IFormFields,
  IWebPayInitial,
  TFieldsItems,
} from "../types";

import { isObject, omit, pick } from "./utils";
import { checkSign, sign } from "./functions";
import { _form_fields } from "../defaults/fields";

enum ErrorMsg {
  MISSING_PARAMS = "missing required params",
  ID_EXISTS = "id exists, skip",
  NOT_OBJECT = "param not Object",
  NOT_ARRAY = "param not Array",
}

const Err = (msg: string, ret: any = undefined) => {
  console.error("Error", msg);
  return ret;
};

interface IFormResultReturnArray {
  name: keyof _IFormFields;
  value: any;
}
type TGetFormObject = Partial<_IFormFields> & {
  [key: string]: any;
  items?: IFieldsItem[];
};

type TGetFormArray = IFormResultReturnArray[];
type TGetFormType = "comma" | "items" | "static" | "flat";

export class WebPayForm {
  #fields: IFormFields = _form_fields;
  #items: IFieldsItem[] = [];
  #secret: string = "";

  constructor({ fields = {}, items = [], secret = "" }: IWebPayInitial = {}) {
    this.fields = fields;
    this.items = items;
    this.#secret = secret;
  }

  set fields(value: Partial<IFormFields>) {
    if (!isObject(value)) {
      Err(ErrorMsg.NOT_OBJECT);
      return;
    }

    let fields = {
      ..._form_fields,
      ...this.#fields,
      ...value,
    };

    let result = omit(fields, [
      "wsb_invoice_item_name",
      "wsb_invoice_item_price",
      "wsb_invoice_item_quantity",
      "wsb_total",
      "wsb_signature",
    ]);

    if (!result.wsb_seed) {
      result.wsb_seed = this.uid();
    }

    this.#fields = result;
  }

  get total() {
    let {
      wsb_tax = 0,
      wsb_shipping_price = 0,
      wsb_discount_price = 0,
    } = this.#fields;

    let result = this.#items.reduce((acc, c) => acc + c.price * c.quantity, 0);
    result = result + wsb_tax + wsb_shipping_price - wsb_discount_price;

    return result;
  }

  uid() {
    return +new Date() + Math.random().toString(36).substr(2, 9);
  }

  set items(items: IFieldsItem[]) {
    if (!Array.isArray(items)) {
      Err(ErrorMsg.NOT_ARRAY);
      return;
    }

    // clean
    this.#items = [];

    // set
    items.forEach((item) => this.addItem(item));
  }

  addItem({ name, price, quantity = 1, id = this.uid() }: IFieldsItem) {
    if (!name || !price) return Err(ErrorMsg.MISSING_PARAMS);

    // check is id
    const foundItem = this.findItem({ id });
    if (foundItem) return Err(ErrorMsg.ID_EXISTS);

    // add
    this.#items.push({ id, name, price, quantity });

    return id;
  }

  findItem({ id }: Pick<IFieldsItem, "id">) {
    const index = this.#items.findIndex((item) => item.id === id);

    if (index !== -1) {
      return { ...this.#items[index], index };
    }
  }

  quantity({
    type = "",
    id,
    value = 1,
  }: {
    type?: "" | "plus" | "minus";
    id: string;
    value?: number;
  }) {
    const item = this.findItem({ id });
    if (!item) return;

    let output = item.quantity;

    switch (type) {
      case "plus":
        output = output + value;
        break;
      case "minus":
        let result = output - value;
        output = result <= 0 ? output : result;
        break;
      default:
        output = value >= 1 ? value : output;
        break;
    }

    this.#items[item.index].quantity = output;
  }

  get items() {
    return this.#items.map(({ index, ...item }) => item);
  }

  getItems() {
    let result: TFieldsItems = {
      wsb_invoice_item_name: [],
      wsb_invoice_item_price: [],
      wsb_invoice_item_quantity: [],
    };

    this.#items.map((item) => {
      result.wsb_invoice_item_name.push(item.name);
      result.wsb_invoice_item_price.push(item.price);
      result.wsb_invoice_item_quantity.push(item.quantity);
    });

    return result;
  }

  getItemsFlat() {
    let result: TGetFormObject = {};

    this.#items.map((item, index) => {
      result[`wsb_invoice_item_name[${index}]`] = item.name;
      result[`wsb_invoice_item_price[${index}]`] = item.price;
      result[`wsb_invoice_item_quantity[${index}]`] = item.quantity;
    });

    return result;
  }

  getForm(type: TGetFormType = "flat") {
    const wsb_signature = sign(
      { ...this.#fields, wsb_total: this.total },
      this.#secret
    );

    let computed = {
      wsb_total: this.total,
      wsb_signature,
    };

    let fields: TGetFormObject = {
      ...this.#fields,
      ...computed,
    };

    switch (type) {
      case "comma":
        fields = {
          ...fields,
          ...this.getItems(),
        };

        break;
      case "flat":
        fields = {
          ...fields,
          ...this.getItemsFlat(),
        };
        break;
      case "items":
        fields.items = this.items;
        break;
      case "static":
        fields = omit(fields, ["wsb_total", "wsb_signature"]);
        break;
    }

    return fields;
  }

  getFormArray(name?: TGetFormType) {
    const fields = this.getForm(name);
    let keys = Object.keys(fields) as Array<keyof _IFormFields>;

    let result = keys.map((key) => {
      return { name: key, value: fields[key] };
    });

    return result as TGetFormArray;
  }
}
