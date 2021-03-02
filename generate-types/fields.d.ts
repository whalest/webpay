export interface IFields {
  name: string;
  required: boolean;
  description: string;
  note: string;
  type?: string;
  default?: any;
}

export interface IFieldsSource extends Omit<IFields, "required"> {
  required: string;
}

export interface ITable {
  id: string;
  name: string;
  type: "form";
}

export interface ITableInputs extends Partial<Omit<ITable, "fields">> {
  selectors?: {
    tr: string;
    name?: string;
  };
}

export interface ITableResult {
  table: ITableInputs;
  fields: IFields[];
}
