import React from 'react';
import Map from './map/Map';
import AlertFeed from './AlertFeed';
import Media from './Media';

const Dashboard = ({ latitude, longitude, alerts }) => (
  <div className="dashboard">
    <div className="map-container" id="map-container">
      <Map latitude={latitude} longitude={longitude} />
    </div>

    <div className="alerts-container">
      <div className="search-alerts">
        <form>
          <input type="text" name="searchAlert" />
          <button type="button">Search Alerts</button>
        </form>
      </div>
      <AlertFeed alerts={alerts} />
    </div>
    <div className="media-container">
      <div className="search-media">
        <form>
          <input type="text" name="searchMedia" />
          <button type="button">Search Media</button>
        </form>
      </div>
      <div className="media-feed">
        <Media />
      </div>
    </div>
  </div>
);
  // }


export default Dashboard;
