import { capitalize } from "./utils";
import { generateTypes, generateDefaults } from "./generate";
import { parseTables } from "./parse";
import axios from "axios";
import fse from "fs-extra";
import { promises as fsp } from "fs";
import prettier from "prettier";

const date = new Date().toISOString().split("T")[0];
const sourceList = [
  { locale: "ru", link: "https://docs.webpay.by/indexRU.html" },
  //{ locale: "en", link: "https://docs.webpay.by/en/index.html" },
];

const start = async (locale: string, link: string) => {
  const file = `./scripts/generate-types/.cache/${date}-${locale}.html`;
  const isCached = await fse.pathExists(file);

  let source = "";

  if (!isCached) {
    source = (await axios.get(link)).data;
    fse.outputFile(file, source);
  } else {
    source = await fsp.readFile(file, "utf-8");
  }

  const tables = parseTables(source);

  let types = generateTypes(tables);
  let defaults = generateDefaults(tables);

  // merge to one
  let output = [types, defaults].join("\n");

  // format
  output = prettier.format(output, {
    parser: "typescript",
  });

  // write
  await fse.outputFile(
    `./src/types/generated/types${capitalize(locale)}.ts`,
    output
  );
};

sourceList.forEach(({ locale, link }) => {
  start(locale, link);
});
