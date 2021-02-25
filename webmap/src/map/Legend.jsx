const Legend = () => {

  return (
    <div className="map-legend">
      <table>
        <tbody>
          <tr>
            <td>
              <span className="dot orient"></span>
            </td>
            <td>
              <label>Travelogues on the Orient</label>
            </td>
          </tr>

          <tr>
            <td>
              <span className="dot non-orient"></span>
            </td>
            <td>
              <label>No Travelogues on the Orient</label>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )

}

export default Legend;