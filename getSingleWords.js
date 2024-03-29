import fs from "fs";
// Read the JSON file
let jsonString = fs.readFileSync("./src/out.json");
let jsonArrayOfObjects = fs.readFileSync("./src/arrayOfObjects.json");

// Parse the JSON string to create an object
let object = JSON.parse(jsonString);
let arrayOfObjects = JSON.parse(jsonArrayOfObjects);

const cities = arrayOfObjects.map((r) => {
  const obj = {};
  obj[r.geniki] = r.english;

  return obj;
});
const arr = object.map((r) => {
  return r.eidos?.split("-").map((e) => e.trim());
});

const flatArr = arr.flat();

function getDistinctEidos() {
  const eidos = [...flatArr];
  return [...new Set(eidos)];
}

const arrXarak = object.map((r) => {
  return r.xaraktiristika?.split("-")[1]?.trim();
});

const flatArrXarak = arrXarak.flat();

function getDistinctXarak() {
  const xarak = [...flatArrXarak];
  return [...new Set(xarak)];
}

const greekWords = [
  "Ακίνητο",
  "Κατοικία",
  "Κατάστημα",
  "Θέση Στάθμευσης (parking)",
  "Αποθήκη",
  "Κινητό",
  "Άλλος τύπος κινητού",
  "Αγροτεμάχιο",
  "Αγροτεμάχιο με κτίσμα",
  "Οικόπεδο",
  "Βιομηχανικός / Βιοτεχνικός Χώρος",
  "Γραφείο",
  "Άλλος Επαγγελματικός Χώρος",
  "Οικόπεδο με κτίσμα",
  "Πλοία",
  "Ξενοδοχειακή Μονάδα",
  "Άλλο",
  "Αττικής",
  "Δυτικής Μακεδονίας",
  "Κεντρικής Μακεδονίας",
  "Βορείου Αιγαίου",
  "Νοτίου Αιγαίου",
  "Θεσσαλίας",
  "Κρήτης",
  "Δυτικής Ελλάδας",
  "Ιονίων Νήσων",
  "Ηπείρου",
  "Ανατολικής Μακεδονίας & Θράκης",
  "Στερεάς Ελλάδας",
  "Πελοποννήσου",
  "Αναψυχής",
  "Δεξαμενόπλοια",
  "Χύδην φορτίου",
  "Επιβατηγά",
];

const englishWords = [
  "Property",
  "Residence",
  "Store",
  "Parking",
  "Warehouse",
  "Movable object", //
  "Other type of movable object",
  "Land Parcel",
  "Land Parcel with building",
  "Plot",
  "Industrial Space",
  "Office",
  "Other Professional Space",
  "Plot with building",
  "Ships",
  "Hotel Unit",
  "Other",
  "Attica",
  "Western Macedonia",
  "Central Macedonia",
  "North Aegean",
  "South Aegean",
  "Thessaly",
  "Crete",
  "Western Greece",
  "Ionian Islands",
  "Epirus",
  "Eastern Macedonia & Thrace",
  "Sterea Ellada",
  "Peloponnese",
  "Recreation",
  "Tankers",
  "Bulk cargo",
  "Passenger ships",
];

greekWords.forEach((word, index) => {
  const obj = {};
  obj[word] = englishWords[index];
  cities.push(obj);
});

// const getEnglishWord = (greekWord, greekWords, englishWords) => {
//   const index = greekWords?.indexOf(greekWord);

//   return englishWords === undefined ? greekWord : englishWords[index];
// };
const translations = {};
cities.map((r) => {
  const key = Object.keys(r)[0];
  const value = Object.values(r)[0];
  translations[key] = value;
});

const translateJsonToEnglish = (json) => {
  const englishJson = json.map((item) => {
    const englishItem = {};
    for (const key in item) {
      if (item.hasOwnProperty(key)) {
        const value = item[key];
        if (
          typeof value === "string" &&
          (key === "eidos" || key === "xaraktiristika")
        ) {
          const englishWord = value
            .split("-")
            .map((e) => translations[e.trim()])
            .join(" - ");

          englishItem[key] = englishWord;
        } else {
          englishItem[key] = value;
        }
      }
    }
    return englishItem;
  });

  return englishJson;
};

const result = translateJsonToEnglish(object);
// write JSON string to a file
fs.writeFile("./src/outEnglish.json", JSON.stringify(result), (err) => {
  if (err) {
    console.log("Error writing file", err);
  } else {
    console.log("Successfully wrote file");
  }
});
