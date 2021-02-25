// Cf. https://github.com/davidchin/react-input-range
import InputRange from 'react-input-range';
import { useState } from 'react';

import './Timeline.scss';

import 'react-input-range/lib/css/index.css';

const Timeline = ({ data }) => {
  
  // Start and end years
  const min = data[0];
  const max = data[data.length - 1];

  const [ range, setRange ] = useState({ min, max});

  const getLeftPct = year =>
    100 * ((year - min) / (max - min))

  return (
    <div className="t6e-timeline">
      <div className="t6e-timeline-inner">
        <div className="t6e-ticks">
          { data.map(year =>
            <div key={year} className="t6e-tick-wrapper" style={{ left: `${getLeftPct(year)}%` }}>
              <div className="t6e-tick" />
            </div>
          )}
        </div>
        <InputRange
          draggableTrack
          minValue={min}
          maxValue={max}
          value={range}
          onChange={value => setRange(value)} />
      </div>
    </div>
  )

}

export default Timeline;