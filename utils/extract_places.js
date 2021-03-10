const fs = require('fs');
const Papa = require('papaparse');

SOURCE_FILES = [
  '../data/source/TravelogueD16_ALMAoutput_20210304.csv',
  '../data/source/TravelogueD17_ALMAoutput_20210304.csv',
  '../data/source/TravelogueD18_ALMAoutput_20210304.csv',
  '../data/source/TravelogueD19-1800-1850_ALMAoutput_20210903.csv'
];

OUTFILE = '../data/unique_places.txt';

const normalizeGND = str => {
  return str.split(';')[0].trim()
}

/**
 * Reads metada CSV source files, and builds a list
 * of all distinct places referenced in the 'Verlagsort normiert ; GND-ID' 
 * and 'Druckort normiert ; GND-ID' columns.
 */
Promise.all(SOURCE_FILES.map(file =>
  new Promise((complete, error) =>
    Papa.parse(fs.createReadStream(file), {
      header: true, complete, error
    })
  )
)).then(results => {
  const verlagsorte = new Set();

  results.forEach(result => {

    const publishingPlaces = result.data.map(obj => obj['Verlagsort normiert ; GND-ID'].trim());
    const printingPlaces = result.data.map(obj => obj['Druckort normiert ; GND-ID'].trim());

    [ ...publishingPlaces, ...printingPlaces ].forEach(colValue => {
      const places = colValue.split(' $ ').map(str => str.trim());
      places.forEach(p => { 
        const normalized = normalizeGND(p);
        if (normalized.length > 0)
          verlagsorte.add(normalized);
      });
    });

  });

  const sorted = Array.from(verlagsorte);
  sorted.sort();
  return sorted;
}).catch(err => 
  console.log(err)
).then(places => {
  fs.writeFile(OUTFILE, places.join('\n'), 'utf8', () => console.log('Done.'));
});