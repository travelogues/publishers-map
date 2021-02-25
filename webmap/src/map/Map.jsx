import bbox from '@turf/bbox';
import { MapConsumer, MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import useSWR from 'swr';

import 'leaflet/dist/leaflet.css';

import './Map.scss';

const DEFAULT_BOUNDS = [
  [ 45, 5 ],
  [ 56, 20 ]
];

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

  return (
    <>
      { featuresToDisplay &&
        <MapContainer bounds={getBounds(data)}>
          <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />

          { featuresToDisplay.map((f, idx) =>
            <Marker key={idx} position={f.geometry.coordinates.slice().reverse()}>
              <Popup>
                <a href={f.properties.geonames_uri}>{f.properties.placename}</a> <br/>
                {f.properties.num_works} works
              </Popup>
            </Marker>
          )}
        </MapContainer>
      }
    </>
  )

}

export default Map;