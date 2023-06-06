import onomata from "./arrayOfObjects.json";

interface City {
  [key: string]: string;
}

const cities: City[] = onomata.map((r) => {
  const obj: City = {};
  obj[r.geniki] = r.english;

  return obj;
});

export const translateFromEnglish = (word: string) => {
  const found = onomata.find((r) => r.english === word);
  if (found) {
    return found.geniki;
  }
  return word;
};

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
  const obj: { [key: string]: string } = {};
  obj[word] = englishWords[index];
  cities.push(obj);
});

interface Translations {
  [key: string]: string;
}

const translations: Translations = {};
cities.map((r) => {
  const key = Object.keys(r)[0];
  const value = Object.values(r)[0];
  translations[key] = value;
});

export default translations;
