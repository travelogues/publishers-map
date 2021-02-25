import Map from './map/Map';
import useSWR from 'swr';

import './App.css';
import Timeline from './timeline/Timeline';

const computeTimeline = data => {
  const reducer = (acc, feature) => {
    feature.records.forEach(r => acc.add(r.year));
    return acc;
  }

  const years = data.features.reduce(reducer, new Set());

  // To array and sort
  return [ ...Array.from(years).sort() ];
}

const App = () => {

  const { data } = useSWR('/map.json', url => fetch(url).then(r => r.json()));

  const onChange = range => {
    console.log(range);
  }

  return (
    <div className="App">
      <Map data={data} />
      { data && 
        <Timeline data={computeTimeline(data)} onChange={onChange} />
      }
    </div>
  );

}

export default App;
