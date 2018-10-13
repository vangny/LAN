import React from 'react';
import Map from './map/Map';
import AlertFeed from './AlertFeed';
import Media from './Media';
import GetAlerts from '../getAlerts';

const Dashboard = ({ latitude, longitude, alerts }) => (
  <div className="dashboard">
    <div className="search-alerts">
      <form>
        <input className="search-bar" placeholder="Search alerts" type="text" name="searchAlert" />
        <button className="search-button" title="Search" value="" type="submit">
          <span className="fas fa-search" />
        </button>
      </form>
    </div>
    <div className="map-container" id="map-container">
      <Map latitude={latitude} longitude={longitude} />
    </div>
    <div className="alerts-container">
      {/* <GetAlerts latitude={latitude} longitude={longitude} /> */}
      <AlertFeed latitude={latitude} longitude={longitude} />
    </div>
    <div className="media-container">
      <div className="media-feed">
        <Media latitude={latitude} longitude={longitude}/>
      </div>
    </div>
  </div>
);

export default Dashboard;
