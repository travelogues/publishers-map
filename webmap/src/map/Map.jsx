import React, { useState } from 'react';
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

const MIN_MARKER_SIZE = 5 * 5;
const MAX_MARKER_SIZE = 32 * 32;

const getBounds = geojson => {
  const bounds = bbox(geojson);
  return [
    bounds.slice(0, 2).slice().reverse(),
    bounds.slice(2).slice().reverse()
  ];
}

/** Helper, so we only compute k & d once, not for every marker **/
const radiusFn = index => {
  const { minWorks, maxWorks } = index;

  const k = (MAX_MARKER_SIZE - MIN_MARKER_SIZE) / (maxWorks - minWorks);
  const d = MIN_MARKER_SIZE - k * minWorks;

  return numWorks => Math.sqrt(k * numWorks + d);
}

const Map = ({ data, index, timerange }) => {

  const [ selectedMarker, setSelectedMarker ] = useState();

  const allFeatures = data?.features.filter(f => f?.geometry.type === 'Point');

  const getRadius = index && radiusFn(index);

  const featuresToDisplay = timerange ? allFeatures.filter(f => {
    const { min, max } = timerange;

    const worksInRange = f.records
      .filter(r => r.year >= min && r.year <= max);
  
    return worksInRange.length > 0; 
  }) : allFeatures;

  const getFeatureInfo = feature => {
    const allWorks = timerange ? feature.records
      .filter(r => r.year >= timerange.min && r.year <= timerange.max) : feature.records;

    const worksWithMarker = selectedMarker ? 
      allWorks.filter(r => r.markers.includes(selectedMarker)) : allWorks;

    const outerRadius = getRadius(allWorks.length);
    const innerRadius = worksWithMarker.length > 0 ? getRadius(worksWithMarker.length) : 0;

    const popup = 
      <Popup>
        <h1><a href={feature.properties.geonames_uri}>{feature.properties.placename}</a></h1>
        { selectedMarker  ?
          <>
            <p>{worksWithMarker.length} works '{selectedMarker}'</p>
            <p>{allWorks.length} works total</p>
          </> : 
          <p>{allWorks.length} works</p>
        }
      </Popup>

    return { outerRadius, innerRadius, popup };
  }

  return (
    <>
      { featuresToDisplay &&
        <>
          <MapContainer bounds={getBounds(data)} preferCanvas={true}>
            <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />

            { featuresToDisplay.map(f => {
              const { outerRadius, innerRadius, popup } = getFeatureInfo(f);
              return (
                <React.Fragment key={f.properties.placename}>
                  <CircleMarker
                    key={`${f.properties.placename}-outer`}
                    center={f.geometry.coordinates.slice().reverse()}
                    radius={outerRadius}
                    pathOptions={STYLE_OUTER}>
                    
                    {popup}

                  </CircleMarker>

                  { selectedMarker && innerRadius > 0 && 
                    <CircleMarker 
                      key={`${f.properties.placename}-inner`} 
                      center={f.geometry.coordinates.slice().reverse()}
                      radius={innerRadius}
                      pathOptions={STYLE_INNER}>
                      
                      { popup }

                    </CircleMarker>
                  }
                </React.Fragment>
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