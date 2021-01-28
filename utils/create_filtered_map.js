const fs = require('fs');

// const INTERVAL = [ 1500, 1599 ];
// const INTERVAL = [ 1600, 1699 ];
// const INTERVAL = [ 1700, 1799 ];
const INTERVAL = [ 1800, 1899 ];

const OUTFILE = '../data/map_19.json'

const unfilteredMap = JSON.parse(fs.readFileSync('../data/map.json', 'utf8'));

const filteredFeatures = unfilteredMap.features.map(feature => {
  // Keep only records that fall within the configured time interval
  const records = feature.records.filter(r => r.year >= INTERVAL[0] && r.year <= INTERVAL[1]);

  // Clone the feature, but update features and properties.num_works
  return {
    ...feature,
    properties: {
      ...feature.properties,
      num_works: records.length
    },
    records
  };
}).filter(feature => 
  // Remove all with 0 works
  feature.properties.num_works > 0
);

const filteredMap = {
  type: 'FeatureCollection',
  features: filteredFeatures
};

fs.writeFile(OUTFILE, JSON.stringify(filteredMap, null, 2), 'utf8', () => console.log('Done.'));