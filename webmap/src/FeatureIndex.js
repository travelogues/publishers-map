/** 
 * Returns the list of distinct markers from all 
 * works at this feature.
 */
const getMarkers = feature =>
  Array.from(
    feature.records.reduce((acc, work) => {
      work.markers.forEach(marker => acc.add(marker));
      return acc;
    }, new Set())
  );

export default class FeatureIndex {

  constructor(geojson) {
    const features = geojson.features.filter(f => f?.geometry.type === 'Point');
    
    // Index features by metadata marker
    const byMarker = {};

    features.forEach(f => {
      getMarkers(f).forEach(marker => {
        const featuresWithMarker = byMarker[marker];
        if (featuresWithMarker) {
          featuresWithMarker.push(f);
        } else {
          byMarker[marker] = [ f ];
        }
      })
    });

    this._features = features;
    this._byMarker = byMarker;
  }

  get features() {
    return this._features;
  } 

  get markers() {
    return Object.keys(this._byMarker);

  }
  
  /** Returns all features with the given marker **/
  findByMarker = marker =>
    this._byMarker[marker];

}