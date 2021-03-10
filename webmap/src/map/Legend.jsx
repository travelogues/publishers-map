const Legend = props => {

  return (
    <div className="map-legend">
      <table>
        <tbody>
          <tr
            className={props.selected === null ? 'selected' : null} 
            onClick={() => props.onSelect()}>
            <td>
              <span className="dot orient"></span>
            </td>
            <td>
              <label>All works</label>
            </td>
          </tr>

          { props.index.markers.map(marker => 
            <tr 
              key={marker} 
              className={props.selected === marker ? 'selected' : null}
              onClick={() => props.onSelect(marker)}>
              <td>
                <span className="dot non-orient"></span>
              </td>
              <td>
                <label>{marker}</label>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )

}

export default Legend;