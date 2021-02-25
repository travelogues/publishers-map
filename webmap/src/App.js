import { useState } from 'react';
import Map from './map/Map';
import useSWR from 'swr';
import Timeline from './timeline/Timeline';

import './App.css';

const computeTimeline = data => {
  const reducer = (acc, feature) => {
    feature.records.forEach(r => acc.add(r.year));
    return acc;
  }

  const years = data.features.reduce(reducer, new Set());

  // To array and sort
  return [ ...Array.from(years).slice().sort() ];
}

const App = () => {

  const { data } = useSWR('/map.json', url => fetch(url).then(r => r.json()));

  const [ timerange, setTimerange ] = useState();

  const onChange = range =>
    setTimerange(range);

  return (
    <div className="App">
      <Map data={data} timerange={timerange} />
      { data && 
        <Timeline data={computeTimeline(data)} onChange={onChange} />
      }
    </div>
  );

}

export default App;
