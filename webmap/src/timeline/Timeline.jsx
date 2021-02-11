import './Timeline.scss';

const Timeline = ({ data }) => {
  
  const min = data[0];
  const max = data[data.length - 1];
  const ticks = data.length;

  const getLeftPct = year =>
    100 * ((year - min) / (max - min))

  return (
    <div className="timeline">
      <div className="timeline-ticks">
        { data.map(year =>
          <div key={year} className="timeline-tick-wrapper" style={{ left: `${getLeftPct(year)}%` }}>
            <div className="timeline-tick" />
          </div>
        )}
      </div>
    </div>
  )

}

export default Timeline;