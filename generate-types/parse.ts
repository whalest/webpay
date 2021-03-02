import $ from "cheerio";
import TurndownService from "turndown";

import { IFields, ITableInputs, ITableResult } from "./fields.d";
import { eachItemHook } from "./knowns";

const turndownService = new TurndownService();

/* turndownService.addRule("br-doc", {
  filter: ["linebreak"],
  replacement: (content) => "*" + content,
}); */

const parseField = (source: string) => {
  let result = turndownService.turndown(source);

  result = result.replace(/[\r\n]+/g, "\r\n\t\t\t\t* ").trim();

  return result;
};

const parseTable = (data: string, tableInputs: ITableInputs): ITableResult => {
  let result: ITableResult = {
    fields: [],
    table: tableInputs,
  };

  if (!tableInputs.selectors?.tr) {
    return result;
  }

  const trList = $(tableInputs.selectors.tr, data);

  trList.each((i, el) => {
    let fields: IFields = {
      name: $("td:eq(0)", el).html() ?? "",
      required: /да|yes/.test($("td:eq(1)", el).html() ?? ""),
      description: parseField($("td:eq(2)", el).html() ?? ""),
      note: parseField($("td:eq(3)", el).html() ?? ""),
    };

    fields = eachItemHook(fields, tableInputs);
    result.fields.push(fields);
  });

  result.table.name = $(tableInputs.selectors?.name || "", data).text();

  return result;
};

export const parseTables = (source: string) => {
  let inputs: ITableInputs[] = [
    {
      id: "main",
      type: "form",
      selectors: {
        tr: "#paymentFormFields + * + .table__wrapper tbody tr",
        name: "#paymentFormFields + h4",
      },
    },
    {
      id: "cart",
      type: "form",
      selectors: {
        tr: "#fieldsForCart + .table__wrapper tbody tr",
        name: "#fieldsForCart",
      },
    },
    {
      id: "additional",
      type: "form",
      selectors: {
        tr: "#fieldsForCart + .table__wrapper + h4 + .table__wrapper tbody tr",
        name: "#fieldsForCart + .table__wrapper + h4",
      },
    },
  ];

  let result: ITableResult[] = [];

  inputs.forEach((table) => {
    const parseResult = parseTable(source, table);
    result.push(parseResult);
  });

  return result;
};
