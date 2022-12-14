import React, { useEffect, useState } from "react";
import GlassCard from "./Components/GlassCard";
import { create, insertBatch, search } from "@lyrasearch/lyra";
import { stemmer } from "@lyrasearch/lyra/dist/esm/stemmer/lib/gr";

// import Turnstone from "turnstone";
import out from "./out.json";

// const styles = {
//   input: "border p-2 bg-white w-full",
//   listbox: "border p-2 bg-white w-full",
// };
const db = create({
  schema: {
    id: "number",
    no_katakyrwsi: "number",
    no_prwti: "number",
    eidos: "string",
    xaraktiristika: "string",
    imnia: "string",
    link: "string",
  },

  defaultLanguage: "greek",
  tokenizer: {
    stemmingFn: stemmer,
  },
});

insertBatch(db, out as any, { batchSize: 1000, language: "greek" });

// const uniqueEidos = out
//   .map((r) => r.eidos)
//   .filter((v, i, a) => a.indexOf(v) === i);

// console.log(uniqueEidos);
// // Set up listbox contents.
// const listbox = {
//   data: uniqueEidos,
//   searchType: "startswith",
// };
// let miniSearch = new MiniSearch({
//   fields: ["xaraktiristika"], // fields to index for full-text search
//   // fields to return with search results
//   storeFields: ["eidos", "no_katakyrwsi", "xaraktiristika"],
//   extractField: (document, fieldName) => {
//     // If field name is 'pubYear', extract just the year from 'pubDate'
//     if (fieldName === "xaraktiristika") {
//       const pubDate = document["xaraktiristika"];
//       return pubDate && pubDate.split(" - ")[2];
//     }

//     // Access nested fields
//     return fieldName.split(".").reduce((doc, key) => doc && doc[key], document);
//   },
// });
// miniSearch.addAll(out);
function cmp(a: number | string, b: number | string) {
  if (a > b) return +1;
  if (a < b) return -1;
  return 0;
}
function convertDateString(dateString: string) {
  // Split the date string into its parts
  const parts = dateString.split("/");

  // Return the date parts in the desired format
  return `${parts[2]}${parts[1]}${parts[0]}`;
}

export default function App() {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [results, setResults] = React.useState([] as any);
  const handleChange = (event: { target: { value: any } }) => {
    // 👇 Get input value from "event"
    setSearchTerm(event.target.value);
  };
  const options = [
    { value: "", text: "Επιλέξτε τρόπο ταξινόμησης" },
    { value: "apple", text: "Φθίνουσα Ημερομηνία" },
    { value: "banana", text: "Αύξουσα Ημερομηνία" },
    { value: "kiwi", text: "Φθίνουσα Τιμή Κατακύρωσης" },
    { value: "orange", text: "Αύξουσα Τιμή Κατακύρωσης" },
  ];
  const [selected, setSelected] = useState(options[0].value);

  useEffect(() => {
    if (searchTerm.length > 1) {
      const res = search(db, {
        term: searchTerm,
        properties: ["xaraktiristika"],
        limit: 100,
      });
      // console.log(res);
      if (selected === "banana") {
        setResults(
          res.hits
            .sort(function (a, b) {
              return cmp(
                convertDateString(a.document.imnia),
                convertDateString(b.document.imnia)
              );
            })
            .map((r) => r.document)
        );
      }
      if (selected === "apple") {
        setResults(
          res.hits
            .sort(function (b, a) {
              return cmp(
                convertDateString(a.document.imnia),
                convertDateString(b.document.imnia)
              );
            })
            .map((r) => r.document)
        );
      }
      if (selected === "kiwi") {
        setResults(
          res.hits
            .sort(function (b, a) {
              return cmp(a.document.no_katakyrwsi, b.document.no_katakyrwsi);
            })
            .map((r) => r.document)
        );
      }
      if (selected === "orange") {
        setResults(
          res.hits
            .sort(function (a, b) {
              return cmp(a.document.no_katakyrwsi, b.document.no_katakyrwsi);
            })
            .map((r) => r.document)
        );
      } else {
        setResults(res.hits.map((r) => r.document));
      }
    }
  }, [searchTerm, selected]);
  const handleSelect = (event: {
    target: { value: React.SetStateAction<string> };
  }) => {
    console.log(event.target.value);
    setSelected(event.target.value);
  };
  return (
    <div className="container mx-auto px-4 py-2 ">
      <input
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        type="text"
        id="message"
        name="message"
        onChange={handleChange}
        autoFocus
        placeholder="π.χ. κατοικια κηφισια, οικοπεδο αιγαιο, νεα σμυρνη κτλ"
      />
      <div className="max-w-xs pt-2">
        <select
          value={selected}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          onChange={handleSelect}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.text}
            </option>
          ))}
        </select>
      </div>

      {!!results.length &&
        results.map(
          (
            r: {
              no_katakyrwsi: number;
              no_prwti: number;
              xaraktiristika: string;
              imnia: string;
              link: string;
            },
            i: number
          ) => (
            <GlassCard
              key={i}
              no_katakyrwsi={r.no_katakyrwsi}
              no_prwti={r.no_prwti}
              xaraktiristika={r.xaraktiristika}
              imnia={r.imnia}
              link={r.link}
            />
          )
        )}
    </div>
  );
}
