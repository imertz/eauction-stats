import fs from "fs";
// Read the JSON file
let jsonString = fs.readFileSync("./src/out.json");

// Parse the JSON string to create an object
let object = JSON.parse(jsonString);
console.log(object.slice(0, 10));

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

console.log(getDistinctXarak());

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
  "Other type of mobile",
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

const getEnglishWord = (greekWord, greekWords, englishWords) => {
  const index = greekWords?.indexOf(greekWord);

  return englishWords === undefined ? greekWord : englishWords[index];
};

const translateJsonToEnglish = (json, greekWords, englishWords) => {
  const englishJson = json.slice(0, 10).map((item) => {
    const englishItem = {};
    for (const key in item) {
      if (item.hasOwnProperty(key)) {
        const value = item[key];
        if (typeof value === "string") {
          const englishWord = value
            .split("-")
            .map((e) => getEnglishWord(e.trim(), greekWords, englishWords))
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

console.log(
  translateJsonToEnglish(object, greekWords, englishWords).slice(0, 10)
);
