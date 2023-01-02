import React, { useEffect, useState } from "react";
import GlassCard from "./Components/GlassCard";
import { create, insertBatch, search } from "@lyrasearch/lyra";
import { stemmer } from "@lyrasearch/lyra/dist/esm/stemmer/lib/gr";
import { useDebounce } from "use-debounce";
// import Turnstone from "turnstone";
import out from "./out.json";

// const styles = {
//   input: "border p-2 bg-white w-full",
//   listbox: "border p-2 bg-white w-full",
// };
const db = create({
  schema: {
    xaraktiristika: "string",
    imnia: "string",
    no_katakyrwsi: "number",
  },

  defaultLanguage: "greek",
  tokenizer: {
    stemmingFn: stemmer,
  },
});

insertBatch(db, out as any, { batchSize: 1000, language: "greek" });

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
  const [count, setCount] = React.useState(0);

  const [debouncedText] = useDebounce(searchTerm, 1000);

  // const [latestSearchTerm, setLatestSearchTerm] = React.useState("");

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
    document.title = `Δ. ${decodeURI(window.location.pathname)
      .replaceAll("/", " ")
      .replaceAll("-", " ")
      .trim()} - Ολοκληρωμένοι Πλειστηριασμοί`;

    // Access initial value from session storage
    let uuid = sessionStorage.getItem("uuid");
    if (uuid == null) {
      // Initialize page views count
      sessionStorage.setItem("uuid", self.crypto.randomUUID());
    }
    setTimeout(() => {
      setSearchTerm(
        decodeURI(window.location.pathname)
          .replaceAll("/", " ")
          .replaceAll("-", " ")
          .trim()
      );
    }, 800);

    setSelected("apple");

    // Update session storage
  }, []);

  useEffect(() => {
    async function postData() {
      if (debouncedText.length > 2) {
        try {
          await fetch("https://api.mysolon.gr", {
            method: "POST",
            body: JSON.stringify({
              q: debouncedText,
              l: "",
              s: sessionStorage.getItem("uuid"),
            }),
            headers: {
              "Content-type": "application/json; charset=UTF-8",
            },
          });
        } catch (err) {
          console.log(err);
        }
      }
    }
    postData();
  }, [debouncedText]);

  useEffect(() => {
    if (searchTerm.length > 1) {
      const res = search(db, {
        term: searchTerm,
        properties: ["xaraktiristika"],
        limit: 1000,
      });
      setCount(res.count);
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
              // @ts-ignore
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
    setSelected(event.target.value);
  };
  return (
    <div className="container mx-auto px-4 py-2 ">
      <h1 className="mb-4 text-xl font-bold tracking-tight leading-none text-gray-100 md:text-4xl lg:text-4xl dark:text-white">
        Αναζητήστε ανάμεσα σε{" "}
        <span className="text-blue-600 dark:text-blue-500">{out.length}</span>{" "}
        ολοκληρωμένους πλειστηριασμούς.
      </h1>

      <input
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
        type="text"
        id="message"
        name="message"
        onChange={handleChange}
        defaultValue={searchTerm}
        autoFocus
        placeholder="π.χ. κατοικια κηφισια, οικοπεδο αιγαιο, νεα σμυρνη κτλ"
      />

      <div className="max-w-xs pt-2">
        <select
          value={selected}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
          onChange={handleSelect}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.text}
            </option>
          ))}
        </select>
      </div>
      <p className="text-sm font-mono text-gray-50 lg:text-sm pt-2">
        Τελευταία ενημέρωση: 22.12.2022, 20:45
      </p>
      {count > 0 && (
        <p className="text-sm font-mono text-gray-50 lg:text-sm pt-2 text-center">
          Βρέθηκαν {count} πλειστηριασμοί
        </p>
      )}
      <section className="results">
        {!!results.length &&
          results.slice(0, 50).map(
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
                q={searchTerm}
              />
            )
          )}
      </section>
    </div>
  );
}
