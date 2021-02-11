import bbox from '@turf/bbox';
import { MapConsumer, MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
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

const Map = props => {

  const { data } = useSWR('/map.json', url => fetch(url).then(r => r.json()));

  const points = data?.features.filter(f => f?.geometry.type === 'Point');

  return (
    <MapContainer bounds={DEFAULT_BOUNDS}>
      <MapConsumer>
        { map => {
          const bounds = data ? getBounds(data) : DEFAULT_BOUNDS;
          map.fitBounds(bounds);
          return null;
        }}
      </MapConsumer>

      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      { points && points.map((f, idx) =>
        <Marker key={idx} position={f.geometry.coordinates.slice().reverse()}>
          <Popup>
            <a href={f.properties.geonames_uri}>{f.properties.placename}</a> <br/>
            {f.properties.num_works} works
          </Popup>
        </Marker>
      )}
    </MapContainer>
  )

}

export default Map;