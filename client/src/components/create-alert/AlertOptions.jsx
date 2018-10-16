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
        <div className="lat-long-container">
          Current coordinates:
          <br />
          {`${latitude}, ${longitude}`}
        </div>
        <div className="category-buttons-container">

          <button id="hurricane-button" className="category-button" type="button" value="hurricane" onClick={e => handleAlertOptions(e.currentTarget.value)}><img className="cat-icon" src={require('../../../button-icons/013-hurricane.png')} value="hurricane" alt="hurricane" /></button>

          <button id="flood-button" className="category-button" type="button" value="flood" onClick={e => handleAlertOptions(e.currentTarget.value)}><img className="cat-icon" src={require('../../../button-icons/016-flood.png')} alt="flood" /></button>

          <button id="forest-fire-button" className="category-button" type="button" value="forest fire" onClick={e => handleAlertOptions(e.currentTarget.value)}><img className="cat-icon" src={require('../../../button-icons/015-fire.png')} alt="forest fire" /></button>

          <button id="house-fire-button" className="category-button" type="button" value="house fire" onClick={e => handleAlertOptions(e.currentTarget.value)}><img className="cat-icon" src={require('../../../button-icons/014-house.png')} alt="forest fire" /></button>

          <button id="earthquake-button" className="category-button" type="button" value="earthquake" onClick={e => handleAlertOptions(e.currentTarget.value)}><img className="cat-icon" src={require('../../../button-icons/018-earthquake.png')} alt="earthquake" /></button>

          <button id="landslide-button" className="category-button" type="button" value="landslide" onClick={e => handleAlertOptions(e.currentTarget.value)}><img className="cat-icon" src={require('../../../button-icons/006-landslide-2.png')} alt="landslide" /></button>

          <button id="traffic-accident-button" className="category-button" type="button" value="traffic accident" onClick={e => handleAlertOptions(e.currentTarget.value)}><img className="cat-icon" src={require('../../../button-icons/car-collision (1).png')} alt="traffic-accident" /></button>

          <button id="volcano-eruption" className="category-button" type="button" value="volcano eruption" onClick={e => handleAlertOptions(e.currentTarget.value)}><img className="cat-icon" src={require('../../../button-icons/002-volcano.png')} alt="volcano-eruption" /></button>

          <button id="tsunami-button" className="category-button" type="button" value="tsunami" onClick={e => handleAlertOptions(e.currentTarget.value)}><img className="cat-icon" src={require('../../../button-icons/003-tsunami.png')} alt="tsunami" /></button>

          <button id="thief-button" className="category-button" type="button" value="criminal activity" onClick={e => handleAlertOptions(e.currentTarget.value)}><img className="cat-icon" src={require('../../../button-icons/thief.png')} alt="thief" /></button>

          <button id="toxic-button" className="category-button" type="button" value="toxic waste" onClick={e => handleAlertOptions(e.currentTarget.value)}><img className="cat-icon" src={require('../../../button-icons/004-waste.png')} alt="toxic waste" /></button>

          <button id="blizzard-button" className="category-button" type="button" value="blizzard" onClick={e => handleAlertOptions(e.currentTarget.value)}><img className="cat-icon" src={require('../../../button-icons/blizzard.png')} alt="blizzard" /></button>

        </div>
      </div>
    ) : (
      <p>
        Still grabbing your location... Please wait
      </p>
    );
};
export default AlertOptions;
