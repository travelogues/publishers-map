import bbox from '@turf/bbox';
import { MapContainer, CircleMarker, Popup, TileLayer } from 'react-leaflet';

import 'leaflet/dist/leaflet.css';

import './Map.scss';

const getBounds = geojson => {
  const bounds = bbox(geojson);
  return [
    bounds.slice(0, 2).slice().reverse(),
    bounds.slice(2).slice().reverse()
  ];
}

const Map = ({ data, timerange }) => {

  const allFeatures = data?.features.filter(f => f?.geometry.type === 'Point');

  const featuresToDisplay = timerange ? allFeatures.filter(f => {
    const { min, max } = timerange;
    const { earliest, latest } = f.properties;
    return earliest <= max && latest >= min; 
  }) : allFeatures;

  // TODO make min/max scale dynamic, based on the values in the data
  const getRadius = feature => {
    const works = timerange ? feature.records
      .map(r => r.year)
      .filter(y => y >= timerange.min && y <= timerange.max).length : feature.properties.num_works;

    return Math.max(5, works / 2.5);
  }

  const style = {
    stroke: true,
    color: '#000',
    weight: 2,
    opacity: 1,
    fill: true,
    fillColor: '#fff',
    fillOpacity: 1
  }

  return (
    <>
      { featuresToDisplay &&
        <MapContainer bounds={getBounds(data)}>
          <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />

          { featuresToDisplay.map((f, idx) =>
            <CircleMarker 
              key={idx} 
              center={f.geometry.coordinates.slice().reverse()}
              radius={getRadius(f)}
              pathOptions={style}>
              <Popup>
                <a href={f.properties.geonames_uri}>{f.properties.placename}</a> <br/>
                {f.properties.num_works} works
              </Popup>
            </CircleMarker>
          )}
        </MapContainer>
      }
    </>
  )

}

export default Map;