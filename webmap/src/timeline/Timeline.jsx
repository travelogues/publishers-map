import InputRange from 'react-input-range';
import { useState } from 'react';

import './Timeline.scss';

import 'react-input-range/lib/css/index.css';

const Timeline = ({ data }) => {

  const [ range, setRange ] = useState({ min: 0, max: 20});

  const min = data[0];
  const max = data[data.length - 1];

  const getLeftPct = year =>
    100 * ((year - min) / (max - min))

  return (
    <div className="t6e-timeline">
      <div className="t6e-ticks">
        { data.map(year =>
          <div key={year} className="t6e-tick-wrapper" style={{ left: `${getLeftPct(year)}%` }}>
            <div className="t6e-tick" />
          </div>
        )}
      </div>

      <InputRange
        draggableTrack
        minValue={0}
        maxValue={20}
        value={range}
        onChange={value => setRange(value)} />
    </div>
  )

}

export default Timeline;