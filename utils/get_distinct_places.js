const fs = require('fs');
const Papa = require('papaparse');

SOURCE_FILES = [
  '../../intertextuality/metadata/TravelogueD16_2020-06-09.csv',
  '../../intertextuality/metadata/TravelogueD17_2020-06-10.csv',
  '../../intertextuality/metadata/TravelogueD18_Orient_2020-11-12.csv',
  '../../intertextuality/metadata/TravelogueD19_1800-1820_Orient_2020-11-12.csv'
];

/**
 * Normalizes a placenamen, fixing the most common patterns in the data
 */
const normalize = str => {
  // Various variations of 'gedruckt (und verlegt) in'
  str = str.replace(/[Gg]e[dt]ruckh?[t/]?( vnn?d verlegt)?( z[uů]|in)?/g, '').trim();
  str = str.replace(/verlegt/g, '').trim();

  // Various variations of 'In'
  str = str.replace(/([Ji]nn? |[Zz]u )/g, '').trim();

  // Enclosing square brackets
  if (/^\[(.*?)\]?/g.test(str)) {
    str = str.replace(/^\[/g, '');
    str = str.replace(/\]$/g, '');
  }

  // Royal fluff :-)
  str = str.replace(/(der Churfürstlichen Stadt|der Fürstl: Statt|der [kK][ae][yi]serlichen Stat?t)/g, '');
  str = str.replace(/(der K[ae]yserliche\[?n\]? (Reychs Statt|Freystat))/g, '');

  return str;
}

Promise.all(SOURCE_FILES.map(file =>
  new Promise((complete, error) =>
    Papa.parse(fs.createReadStream(file), {
      header: true, complete, error
    })
  )
)).then(results => {
  const verlagsorte = new Set();

  results.forEach(result => {
    const placeColumn = result.data.map(obj => obj.Verlagsort.trim());
    placeColumn.forEach(colValue => {
      const places = colValue.split(/und|;/i).map(str => str.trim());
      places.forEach(p => verlagsorte.add(normalize(p)));
    });
  });

  const sorted = Array.from(verlagsorte);
  sorted.sort();
  return sorted;
}).catch(err => 
  console.log(err)
).then(places => {
  places.forEach(p => console.log(p));
});


// Step 1: load source CSV files

// Step 2: grab column 'Verlagsorte'

// Step 3: split on 'und'

// Step 4: create set

// Step 5: write result .txt, one placename per line