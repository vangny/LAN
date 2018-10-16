import React from 'react';

const AlertOptions = ({ latitude, longitude, appContext, handleAlertOptions }) => {
  navigator.geolocation.watchPosition((position) => {
    appContext.setState({
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    }, () => {
      // console.log('Updated coordinates: ', position.coords.latitude, position.coords.longitude);
    });
  });
  return latitude !== 'Loading...'
    ? (
      <div>
        <div>{`lat: ${latitude} long: ${longitude}`}</div>
        <div className="category-buttons-container">

          <button id="hurricane-button" className="category-button" type="button" value="hurricane" onClick={e => handleAlertOptions(e.target.value)}>hurricane</button>

          <button id="flood-button" className="category-button" type="button" value="flood" onClick={e => handleAlertOptions(e.target.value)}>{/*<img src={require('../../../dist/button-icons/016-flood.png')} alt="Flood" />*/}flood</button>

          <button id="fire-button" className="category-button" type="button" value="fire" onClick={e => handleAlertOptions(e.target.value)}>fire</button>

          <button id="earthquake-button" className="category-button" type="button" value="earthquake" onClick={e => handleAlertOptions(e.target.value)}>earthquake</button>

          <button id="traffic-accident-button" className="category-button" type="button" value="traffic accident" onClick={e => handleAlertOptions(e.target.value)}>car crash</button>

          <button id="volcano-eruption" className="category-button" type="button" value="volcano eruption" onClick={e => handleAlertOptions(e.target.value)}>Volcano Eruption</button>

          <button id="tsunami-button" className="category-button" type="button" value="tsunami" onClick={e => handleAlertOptions(e.target.value)}>Tsunami</button>


        </div>
      </div>
    ) : (
      <p>
        Still grabbing your location... Please wait
      </p>
    );
};
export default AlertOptions;
