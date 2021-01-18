const { SourceMap } = require('module');
const fs = require('fs');
const Papa = require('papaparse');
const file = 

SOURCE_FILES = [
  '../../intertextuality/metadata/TravelogueD16_2020-06-09.csv',
  '../../intertextuality/metadata/TravelogueD17_2020-06-10.csv',
  '../../intertextuality/metadata/TravelogueD18_Orient_2020-11-12.csv',
  '../../intertextuality/metadata/TravelogueD19_1800-1820_Orient_2020-11-12.csv'
];

const Verlagsorte = new Set();

Promise.all(SOURCE_FILES.map(file =>
  new Promise((complete, error) =>
    Papa.parse(fs.createReadStream(file), {
      header: true, complete, error
    })
  )
)).then(results => {
  results.forEach(result => {
    const placeColumn = result.data.map(obj => obj.Verlagsort.trim());
    placeColumn.forEach(colValue => {
      const places = colValue.split('und').map(str => str.trim());
      places.forEach(p => Verlagsorte.add(p));
    });
  });

  console.log(Verlagsorte);
}).catch(err => console.log(err));

// Step 1: load source CSV files

// Step 2: grab column 'Verlagsorte'

// Step 3: split on 'und'

// Step 4: create set

// Step 5: write result .txt, one placename per line