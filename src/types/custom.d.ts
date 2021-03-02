// TODO: i18n types by EJS template
import { _IFormFields } from "./generated/typesRu";
import { IFieldsSession } from "./knows";

export type TSignFields = Pick<
  _IFormFields,
  | "wsb_seed"
  | "wsb_storeid"
  | "wsb_order_num"
  | "wsb_test"
  | "wsb_currency_id"
  | "wsb_total"
  | "wsb_version"
>;

export type TFieldsItems = Pick<
  _IFormFields,
  | "wsb_invoice_item_name"
  | "wsb_invoice_item_price"
  | "wsb_invoice_item_quantity"
>;

export interface IFormFields
  extends Omit<
      _IFormFields,
      keyof TFieldsItems | "wsb_total" | "wsb_signature"
    >,
    IFieldsSession {}

export interface IFieldsItem {
  id?: string;
  index?: number;
  // TODO: tsdoc
  price: number;
  quantity: number;
  name: string;
}

export interface IWebPayInitial {
  fields?: Partial<IFormFields>;
  items?: IFieldsItem[];
  secret?: string;
}
