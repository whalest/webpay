import { getDate, capitalize } from "./utils";
import { IFields, ITable, ITableResult } from "./fields.d";

const interfacePrefix = "_IFormFields";

export const generateTypes = (tables: ITableResult[]) => {
  let result: string[] = [
    `
    /* 
      Auto generated Webpay types
      ${getDate()}
    */\n`,
  ];
  let interfaces: string[] = [];

  result.push(`
    export type TCurrency = "BYN" | "USD" | "EUR" | "RUB";
    export type TLanguage = "russian" | "english";
  `);

  tables.forEach((tableItem) => {
    const name = capitalize(tableItem.table.id || "");
    const interfaceName = `${interfacePrefix}${name}`;

    interfaces.push(interfaceName);

    let fields: string[] = [];
    tableItem.fields.forEach((fieldItem) => {
      let title = `/** ${fieldItem.description} ${
        fieldItem.note ? `\n* @remarks ${fieldItem.note}\n` : ""
      } */`;

      let content = `
      "${fieldItem.name}"${fieldItem.required ? "" : "?"}: ${
        fieldItem.type ?? "string"
      };
     `;

      fields.push(`${title}${content}\n`);
    });

    result.push(`
    /** ${tableItem.table.name} */
    export interface ${interfaceName} {
      ${fields.join("")}
    }    
    `);
  });

  // TODO: parse name
  result.push(`
  
    /** Поля формы оплаты */
    export interface ${interfacePrefix} extends ${interfaces.join(",")}{  
    }
  `);

  return result.join("");
};

export const generateDefaults = (tables: ITableResult[]) => {
  let result: string[] = [];
  let form_result: string[] = [];

  tables.forEach((tableItem) => {
    // generate only form
    if (tableItem.table.type === "form") {
      let fields: string[] = [];

      tableItem.fields.forEach((fieldItem) => {
        if (fieldItem.required) {
          fields.push(`"${fieldItem.name}": ${fieldItem.default ?? `""`},`);
        }
      });

      form_result.push(fields.join(""));
    }
  });

  if (form_result.length) {
    result.push(`
    /** Поля формы оплаты по умолчанию */
    export const _form_fields : ${interfacePrefix} = {
      ${form_result.join("")}
    }`);
  }
  return result.join("");
};
