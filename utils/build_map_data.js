const fs = require('fs');
const Papa = require('papaparse');

/**
 * The map data file is essentially built by JOINing data from 
 * the original source CSVs and the geocoding CSV.
 */

METADATA = [
  '../data/source/TravelogueD16_ALMAoutput_20210304.csv',
  '../data/source/TravelogueD17_ALMAoutput_20210304.csv',
  '../data/source/TravelogueD18_ALMAoutput_20210304.csv',
  '../data/source/TravelogueD19-1800-1850_ALMAoutput_20210903.csv'
];

GEOLOCATIONS = '../data/unique_places_geocoded.csv';

OUTFILE = '../data/map.json';

const parsePlaces = val => {
  // Multiple places are separated by -. (convention)
  const tokens = val.split('-.').map(str => str.trim());

  // Each places is (usually "placename ; GND-ID")
  return tokens.map(token => token.split(';')[0].trim())
    .filter(token => token.length > 0);
}

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
  const geolocations = result[0].data;
  
  const records = [ 
    ...result[1].data, 
    ...result[2].data, 
    ...result[3].data, 
    ...result[4].data ];

  // Step 2 - build an index of the metadata records by placename
  const recordIndex = {};
  
  records.forEach(record => {
    const id = record['Systemnummer'];

    const year = parseInt(record['Erscheinungsjahr Sortierform']);
    
    const markers = Array.from(new Set(
      record['Marker'].split(/[\s;]/g)
        .filter(token => token.length > 0)
    ));

    const publicationPlaces = parsePlaces(record['Verlagsort normiert ; GND-ID']);
    const printingPlaces = parsePlaces(record['Druckort normiert ; GND-ID']);

    const distinctPlaces = Array.from(new Set([ ...publicationPlaces, ...printingPlaces ]));

    distinctPlaces.forEach(placename => {
      const tags = [];

      if (publicationPlaces.includes(placename))
        tags.push('publication_place');

      if (printingPlaces.includes(placename))
        tags.push('printing_place');

      const simplifiedRecord = {
        id, year, markers, tags, all_places: distinctPlaces
      };

      const existing = recordIndex[placename];
      if (existing) { 
        existing.push(simplifiedRecord);
      } else {
        recordIndex[placename] = [ simplifiedRecord ];
      }
    });
  });

  // Step 3 - create GeoJSON-compatible data file
  const mapData = {
    type: 'FeatureCollection',
    features: []
  }

  for (const [key, value] of Object.entries(recordIndex)) {
    const place = geolocations.find(g => g.Ort === key.trim());

    const years = value.map(r => r.year).slice().sort();

    const earliest = years[0];
    const latest = years[years.length - 1];

    try {
      mapData.features.push({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [ parseFloat(place.Lon), parseFloat(place.Lat) ]
        },
        properties: { 
          placename: key,
          geonames_uri: place.GeoNames,
          num_works: value.length,
          earliest,
          latest
        },
        records: value
      });
    } catch (error) {
      console.log('ERROR', JSON.stringify(key));
      throw error;
    }
  }

  // Step 4 - write results
  fs.writeFile(OUTFILE, JSON.stringify(mapData, null, 2), 'utf8', () => console.log('Done.'));
}).catch(error => { 
  console.log(error)
});
