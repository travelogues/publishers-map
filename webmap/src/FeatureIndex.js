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

    let maxWorksPerPlace = 0;
    let minWorksPerPlace = Infinity;

    // For later optimizations: index features by metadata marker
    const byMarker = {};

    features.forEach(f => {
      const { num_works } = f.properties;

      if (num_works > maxWorksPerPlace)
        maxWorksPerPlace = num_works;

      if (num_works < minWorksPerPlace)
        minWorksPerPlace = num_works;

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
    this._maxWorksByPlace = maxWorksPerPlace;
    this._minWorksByPlace = minWorksPerPlace;
    this._byMarker = byMarker;
  }

  get features() {
    return this._features;
  } 

  /**
   * The maximum number of works that exist at any place.
   */
  get maxWorks() {
    return this._maxWorksByPlace;
  }

  /** 
   * The minimum number of works that exist at any place.
   * 
   * Probably always 1, but for completeness...
   */
  get minWorks() {
    return this._minWorksByPlace;
  }

  get markers() {
    return Object.keys(this._byMarker).slice().sort();

  }
  
  /** Returns all features with the given marker **/
  findByMarker = marker =>
    this._byMarker[marker];

}