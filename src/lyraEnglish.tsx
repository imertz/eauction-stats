import { create, insertBatch, search } from "@lyrasearch/lyra";
import { stemmer } from "@lyrasearch/lyra/dist/esm/stemmer/lib/en";
import out from "./outEnglish.json";
const db = create({
  schema: {
    xaraktiristika: "string",
    imnia: "string",
    no_katakyrwsi: "number",
  },

  defaultLanguage: "english",
  tokenizer: {
    stemmingFn: stemmer,
  },
});

insertBatch(db, out as any, {
  batchSize: 1000,
  language: "english",
});
function helloEnglish(searchTerm: string) {
  const res = search(db, {
    term: searchTerm,
    properties: ["xaraktiristika"],
    limit: 1000,
  });

  return res;
}

// eslint-disable-next-line import/no-anonymous-default-export
export { helloEnglish };
