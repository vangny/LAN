import React from 'react';


const AlertOptions = ({ latitude, longitude, appContext, handleAlertOptions }) => {
  navigator.geolocation.watchPosition((position) => {
    appContext.setState({
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    }, () => {
      console.log('Updated coordinates: ', position.coords.latitude, position.coords.longitude);
    });
  });
  return (
    <div>
      <div>{`lat: ${latitude} long: ${longitude}`}</div>
      <button id="hurricane" type="button" value="hurricane" onClick={e => handleAlertOptions(e.target.value)}>hurricane</button>
      <button id="flood" type="button" value="flood" onClick={e => handleAlertOptions(e.target.value)}>flood</button>
      <button id="wildfire" type="button" value="wildfire" onClick={e => handleAlertOptions(e.target.value)}>wildfire</button>
      <button id="earthquake" type="button" value="earthquake" onClick={e => handleAlertOptions(e.target.value)}>earthquake</button>
    </div>
  );
};
export default AlertOptions;
