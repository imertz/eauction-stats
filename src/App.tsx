import React from "react";
import GlassCard from "./Components/GlassCard";
// import Turnstone from "turnstone";
// import out from "./out.json";

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

export default function App() {
  return (
    <div className="p-3">
      <p>HI</p>
      <GlassCard />
      <GlassCard />
      <GlassCard />
      <GlassCard />
      <GlassCard />
      <GlassCard />
      <GlassCard />
      <GlassCard />
      <GlassCard />
      <GlassCard />
    </div>
  );
}
