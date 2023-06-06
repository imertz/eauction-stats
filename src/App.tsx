import React, { useEffect, useState, useMemo } from "react";
import GlassCard from "./Components/GlassCard";

import { useDebounce } from "use-debounce";
import { createWorkerFactory, useWorker } from "@shopify/react-web-worker";
import onomata from "./arrayOfObjects.json";
import dataCount from "./dataCount.json";
import Footer from "./Components/Footer";
const createWorker = createWorkerFactory(() => import("./lyra"));

const dateTimeAthens = (datetime: string) => {
  const date = new Date(datetime + "Z");

  return date.toLocaleString("el-GR", {
    timeZone: "Europe/Athens",
    hour12: false,
  });
};

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
  const worker = useWorker(createWorker);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [count, setCount] = React.useState(0);
  const [data, setData] = React.useState([] as any);

  const [debouncedText] = useDebounce(searchTerm, 1000);

  // const [latestSearchTerm, setLatestSearchTerm] = React.useState("");

  const [results, setResults] = React.useState([] as any);
  const [english, setEnglish] = React.useState(false);

  const handleChange = (event: { target: { value: any } }) => {
    // 👇 Get input value from "event"
    setSearchTerm(event.target.value);
  };

  const optionsGreek = [
    { value: "", text: "Επιλέξτε τρόπο ταξινόμησης" },
    { value: "apple", text: "Φθίνουσα Ημερομηνία" },
    { value: "banana", text: "Αύξουσα Ημερομηνία" },
    { value: "kiwi", text: "Φθίνουσα Τιμή Κατακύρωσης" },
    { value: "orange", text: "Αύξουσα Τιμή Κατακύρωσης" },
  ];

  const optionsEnglish = [
    { value: "", text: "Select sorting method" },
    { value: "apple", text: "Descending Date" },
    { value: "banana", text: "Ascending Date" },
    { value: "kiwi", text: "Descending Price" },
    { value: "orange", text: "Ascending Price" },
  ];

  const options = english ? optionsEnglish : optionsGreek;
  const [selected, setSelected] = useState(options[0].value);

  useEffect(() => {
    const dimosDash = decodeURI(window.location.pathname).split("/").pop();

    const dimos = decodeURI(window.location.pathname)
      .replaceAll("/", " ")
      .replaceAll("-", " ")
      .trim();
    if (dimos === "en") {
      setEnglish(true);
    }
    const onomastiki = onomata.find((o) => o.geniki === dimos);

    if (onomastiki !== undefined) {
      import(`./data/${dimosDash}/index.json`).then((math) => {
        setData(math.default);
        document.title = `${onomastiki.onomastiki} - Πλειστηριασμοί για ${math.default.length} ακίνητα - Οι τιμές που πωλήθηκαν.`;
      });
    }

    // Access initial value from session storage
    let uuid = sessionStorage.getItem("uuid");
    if (uuid == null) {
      // Initialize page views count
      sessionStorage.setItem("uuid", self.crypto.randomUUID());
    }
    // Update session storage
  }, []);

  useEffect(() => {
    async function postData() {
      if (debouncedText.length > 0) {
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
    const lyraWorkerRun = async () => {
      if (searchTerm.length > 1) {
        const res = await worker.hello(searchTerm);
        setCount(res.count);
        // console.log(res);
        if (selected === "banana") {
          setResults(
            res.hits
              .sort(function (
                a: { document: { imnia: string } },
                b: { document: { imnia: string } }
              ) {
                return cmp(
                  convertDateString(a.document.imnia),
                  convertDateString(b.document.imnia)
                );
              })
              .map((r: { document: any }) => r.document)
          );
        }
        if (selected === "apple") {
          setResults(
            res.hits
              .sort(function (
                b: { document: { imnia: string } },
                a: { document: { imnia: string } }
              ) {
                return cmp(
                  convertDateString(a.document.imnia),
                  convertDateString(b.document.imnia)
                );
              })
              .map((r: { document: any }) => r.document)
          );
        }
        if (selected === "kiwi") {
          setResults(
            res.hits
              .sort(function (
                b: { document: { no_katakyrwsi: string | number } },
                a: { document: { no_katakyrwsi: string | number } }
              ) {
                return cmp(a.document.no_katakyrwsi, b.document.no_katakyrwsi);
              })
              .map((r: { document: any }) => r.document)
          );
        }
        if (selected === "orange") {
          setResults(
            res.hits
              .sort(function (
                a: { document: { no_katakyrwsi: string | number } },
                b: { document: { no_katakyrwsi: string | number } }
              ) {
                // @ts-ignore
                return cmp(a.document.no_katakyrwsi, b.document.no_katakyrwsi);
              })
              .map((r: { document: any }) => r.document)
          );
        } else {
          setResults(res.hits.map((r: { document: any }) => r.document));
        }
      } else {
        if (selected === "banana") {
          setData(
            data
              .sort(function (a: { imnia: string }, b: { imnia: string }) {
                return cmp(
                  convertDateString(a.imnia),
                  convertDateString(b.imnia)
                );
              })
              .map((r: any) => r)
          );
        }
        if (selected === "apple") {
          setData(
            data
              .sort(function (b: { imnia: string }, a: { imnia: string }) {
                return cmp(
                  convertDateString(a.imnia),
                  convertDateString(b.imnia)
                );
              })
              .map((r: any) => r)
          );
        }
        if (selected === "kiwi") {
          setData(
            data
              .sort(function (
                b: { no_katakyrwsi: string | number },
                a: { no_katakyrwsi: string | number }
              ) {
                return cmp(a.no_katakyrwsi, b.no_katakyrwsi);
              })
              .map((r: any) => r)
          );
        }
        if (selected === "orange") {
          setData(
            data
              .sort(function (
                a: { no_katakyrwsi: string | number },
                b: { no_katakyrwsi: string | number }
              ) {
                // @ts-ignore
                return cmp(a.no_katakyrwsi, b.no_katakyrwsi);
              })
              .map((r: any) => r)
          );
        }
      }
    };
    console.log(selected);

    lyraWorkerRun();
  }, [searchTerm, selected]);
  const handleSelect = (event: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setSelected(event.target.value);
  };
  const display = !!results.length ? results : data;
  return (
    <div className="container mx-auto px-4 py-2 ">
      {!english ? (
        <h1 className="mb-4 text-xl font-bold tracking-tight leading-none text-gray-100 md:text-4xl lg:text-4xl dark:text-white">
          Αναζητήστε ανάμεσα σε{" "}
          <span className="text-blue-600 dark:text-blue-500">
            {dataCount[0].count}
          </span>{" "}
          ολοκληρωμένους πλειστηριασμούς.
        </h1>
      ) : (
        <h1 className="mb-4 text-xl font-bold tracking-tight leading-none text-gray-100 md:text-4xl lg:text-4xl dark:text-white">
          Search among{" "}
          <span className="text-blue-600 dark:text-blue-500">
            {dataCount[0].count}
          </span>{" "}
          completed auctions.
        </h1>
      )}

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
        Τελευταία ενημέρωση: {dateTimeAthens(dataCount[0].date)}
      </p>
      {display.length > 0 && (
        <p className="text-sm font-mono text-gray-50 lg:text-sm pt-2 text-center">
          Βρέθηκαν {display.length} πλειστηριασμοί
        </p>
      )}
      <section className="results">
        {!!display.length &&
          display.slice(0, 50).map(
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
      <Footer
        links={
          onomata.map((r) => {
            return {
              name: r.onomastiki,
              link: `https://eauctionstats.mysolon.gr/${r?.geniki?.replaceAll(
                " ",
                "-"
              )}`,
            };
          }) as { name: string; link: string }[]
        }
      />
    </div>
  );
}
