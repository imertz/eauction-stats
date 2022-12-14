import React, { useEffect } from "react";
import GlassCard from "./Components/GlassCard";
import MiniSearch from "minisearch";
// import Turnstone from "turnstone";
import out from "./out.json";

// const styles = {
//   input: "border p-2 bg-white w-full",
//   listbox: "border p-2 bg-white w-full",
// };

// const uniqueEidos = out
//   .map((r) => r.eidos)
//   .filter((v, i, a) => a.indexOf(v) === i);

// console.log(uniqueEidos);
// // Set up listbox contents.
// const listbox = {
//   data: uniqueEidos,
//   searchType: "startswith",
// };
console.log(out.slice(0, 10));
let miniSearch = new MiniSearch({
  fields: ["eidos"], // fields to index for full-text search
  // fields to return with search results
  storeFields: ["eidos", "no_katakyrwsi"],
});
miniSearch.addAll(out.slice(0, 10));
export default function App() {
  const [search, setSearch] = React.useState("");
  const [results, setResults] = React.useState([] as any);
  const handleChange = (event: { target: { value: any } }) => {
    // 👇 Get input value from "event"
    setSearch(event.target.value);
  };

  useEffect(() => {
    console.log(search);

    setResults(
      miniSearch.search(search, {
        prefix: true,
        fuzzy: 0.2,
      })
    );
    console.log(
      miniSearch.search(search, {
        prefix: true,
        fuzzy: 0.2,
      })
    );
  }, [search]);

  return (
    <div className="p-3">
      <input type="text" id="message" name="message" onChange={handleChange} />
      {results.map((r) => (
        <GlassCard no_katakyrwsi={r.no_katakyrwsi} />
      ))}
    </div>
  );
}
