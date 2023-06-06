import fs from "fs";

// Read in the JSON file
let rawData = fs.readFileSync("./src/out.json");

// Parse the JSON string into an object
let data = JSON.parse(rawData);
function removeDiacritics(str) {
  // return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  return str;
}

const arr = data.map((r) => {
  const obj = {};
  obj.eidos =
    r.xaraktiristika?.split("-")[0]?.trim() &&
    "https://eauctionstats.mysolon.gr/" +
      removeDiacritics(r.xaraktiristika?.split("-")[0]?.trim()).replaceAll(
        " ",
        "-"
      );
  obj.perifereia =
    r.xaraktiristika?.split("-")[1]?.trim() &&
    "https://eauctionstats.mysolon.gr/" +
      removeDiacritics(r.xaraktiristika?.split("-")[1]?.trim()).replaceAll(
        " ",
        "-"
      );
  obj.dimos =
    r.xaraktiristika?.split("-")[2]?.trim() &&
    "https://eauctionstats.mysolon.gr/" +
      removeDiacritics(r.xaraktiristika?.split("-")[2]?.trim()).replaceAll(
        " ",
        "-"
      );
  return obj;
});

function getDistinctDimos() {
  const dimos = arr.map((r) => r.dimos);
  return [...new Set(dimos)];
}

const dimoi = getDistinctDimos();
dimoi.forEach((e) => {
  const d = e?.split("/").at(-1);
  const filteredData = data.filter((obj) =>
    obj["xaraktiristika"]?.includes(d?.replaceAll("-", " "))
  );
  if (!fs.existsSync(`./src/data/${d}`)) {
    fs.mkdirSync(`./src/data/${d}`);
  }
  fs.writeFileSync(`./src/data/${d}/index.json`, JSON.stringify(filteredData));
});
