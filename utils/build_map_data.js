const fs = require('fs');
const Papa = require('papaparse');

/**
 * The map data file is essentially built by JOINing data from 
 * the original source CSVs and the geocoding CSV.
 */

METADATA = [
  '../../intertextuality/metadata/TravelogueD16_2020-06-09.csv',
  '../../intertextuality/metadata/TravelogueD17_2020-06-10.csv',
  '../../intertextuality/metadata/TravelogueD18_Orient_2020-11-12.csv',
  '../../intertextuality/metadata/TravelogueD19_1800-1820_Orient_2020-11-12.csv'
];

GEOLOCATIONS = '../data/unique_places_geocoded.csv';

// Step 1 - load data into mem
const fLoadGeoLocations = new Promise((complete, error) =>
  Papa.parse(fs.createReadStream(GEOLOCATIONS), {
    header: true, complete, error
  })
)

const fLoadMetadata = METADATA.map(f => new Promise((complete, error) =>
  Papa.parse(fs.createReadStream(f), {
    header: true, complete, error
  })
));

Promise.all([ fLoadGeoLocations, ...fLoadMetadata ]).then(result => {
  console.log(result);
}).catch(error => console.log(error));

// (Step 2 - build an index of the metadata records by place) - probably not even necessary, because our dataset is so small

// Step 3 - for each place, get metadata records. Reduce them to a tuple Systemnr/year/tags ('printing_place', 'publishing_place')

// Step 4 - output result file: list of places, each linked to the list of tuples

// Let's us filter by time and aggregate counts for each place on the fly, so we can do proportional symbol mapping