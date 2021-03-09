import { useState } from 'react';
import bbox from '@turf/bbox';
import { MapContainer, CircleMarker, Popup, TileLayer } from 'react-leaflet';
import Legend from './Legend';

import 'leaflet/dist/leaflet.css';

import './Map.scss';

const STYLE_OUTER = {
  stroke: true,
  color: '#4e4e4e',
  weight: 1.5,
  opacity: 1,
  fill: true,
  fillColor: '#b7b7b7',
  fillOpacity: 1
};

const STYLE_INNER = {...STYLE_OUTER, 
  color: '#bf7814',
  fillColor: '#ff9a1e' 
};

const getBounds = geojson => {
  const bounds = bbox(geojson);
  return [
    bounds.slice(0, 2).slice().reverse(),
    bounds.slice(2).slice().reverse()
  ];
}

const Map = ({ data, index, timerange }) => {

  const [ selectedMarker, setSelectedMarker ] = useState();

  const allFeatures = data?.features.filter(f => f?.geometry.type === 'Point');

  const featuresToDisplay = timerange ? allFeatures.filter(f => {
    const { min, max } = timerange;
    const { earliest, latest } = f.properties;
    return earliest <= max && latest >= min; 
  }) : allFeatures;

  const hasSelectedMarker = feature => {
    const getMarkersInRange = feature => {
      const worksInRange = feature.records.filter(w => w.year >= timerange.min && w.year <= timerange.max);
      return new Set(worksInRange.reduce((acc, w) => acc.concat(w.markers), []));
    }

    const markers = timerange ? getMarkersInRange(feature) :
      new Set(feature.records.reduce((acc, f) => acc.concat(f.markers), []));

    return markers.has(selectedMarker);
  }

  // TODO make min/max scale dynamic, based on the values in the data
  const getRadius = feature => {
    const allWorks = timerange ? feature.records
      .filter(r => r.year >= timerange.min && r.year <= timerange.max) : feature.records;

    const worksWithMarker = selectedMarker ? 
      allWorks.filter(r => r.markers.includes(selectedMarker)) : allWorks;

    const outer = Math.max(3, allWorks.length / 2.5);
    const inner = worksWithMarker.length > 0 ? Math.max(3, worksWithMarker.length / 2.5) : 0;
    
    return { outer, inner };
  }

  return (
    <>
      { featuresToDisplay &&
        <>
          <MapContainer bounds={getBounds(data)} preferCanvas={true}>
            <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />

            { featuresToDisplay.map((f, idx) => {
              const { outer, inner } = getRadius(f);
              return (
                <>
                  <CircleMarker
                    key={`${idx}-outer`}
                    center={f.geometry.coordinates.slice().reverse()}
                    radius={outer}
                    pathOptions={STYLE_OUTER} />

                  { selectedMarker && inner > 0 && <CircleMarker 
                      key={`${idx}-inner`} 
                      center={f.geometry.coordinates.slice().reverse()}
                      radius={inner}
                      pathOptions={STYLE_INNER}>
                      <Popup>
                        <a href={f.properties.geonames_uri}>{f.properties.placename}</a> <br/>
                        {f.properties.num_works} works
                      </Popup>
                    </CircleMarker>
                  }
                </>
              )
            })}
          </MapContainer>

          <Legend
            index={index} 
            selected={selectedMarker}
            onSelect={marker => setSelectedMarker(marker) }/>
        </>
      }
    </>
  )

}

export default Map;