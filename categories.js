import fs from 'fs';
import xmlbuilder from 'xmlbuilder';
// Read the JSON file
let jsonString = fs.readFileSync('./src/out.json');
function removeDiacritics(str) {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}


// Parse the JSON string to create an object
let object = JSON.parse(jsonString);

const arr = object.map(r => {
  const obj = {}
  obj.eidos = r.xaraktiristika?.split('-')[0]?.trim() && 'https://eauctionstats.mysolon.gr/' + removeDiacritics(r.xaraktiristika?.split('-')[0]?.trim()).replaceAll(' ', '-')
  obj.perifereia = r.xaraktiristika?.split('-')[1]?.trim() && 'https://eauctionstats.mysolon.gr/' + removeDiacritics(r.xaraktiristika?.split('-')[1]?.trim()).replaceAll(' ', '-')
  obj.dimos = r.xaraktiristika?.split('-')[2]?.trim() && 'https://eauctionstats.mysolon.gr/' + removeDiacritics(r.xaraktiristika?.split('-')[2]?.trim()).replaceAll(' ', '-')
  return obj
})

function getDistinctEidos() {
  const eidos = arr.map(r => r.eidos)
  return [...new Set(eidos)]
}
function getDistinctPerifereia() {
  const perifereia = arr.map(r => r.perifereia)
  return [...new Set(perifereia)]
}
function getDistinctDimos() {
  const dimos = arr.map(r => r.dimos)
  return [...new Set(dimos)]
}
const allArr = [...getDistinctEidos(), ...getDistinctPerifereia(), ...getDistinctDimos()]
// Create the XML sitemap
let sitemap = xmlbuilder.create('urlset', { version: '1.0', encoding: 'UTF-8' })
  .att('xmlns', 'http://www.sitemaps.org/schemas/sitemap/0.9');

// Add the links to the sitemap
allArr.forEach((link) => {
  sitemap.ele('url')
    .ele('loc', link)
    .up()
    .ele('lastmod', '2022-12-25')
});

// Convert the sitemap to a string
let xmlString = sitemap.end({ pretty: true });

// Write the string to a file
fs.writeFileSync('sitemap.xml', xmlString);

