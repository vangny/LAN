import React, { Component } from 'react';
import Map from './map-components/Map';
import Home from '../Home';

export default class Dashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      searchAlerts: '',
    };
  }

  render() {
    const { latitude, longitude } = this.props;

    return (
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
          <Home />
          {/* input alerts component */}
        </div>
        <div className="media-container">
          <div className="search-media">
            <form>
              <input type="text" name="searchMedia" />
              <button type="button">Search Media</button>
            </form>
          </div>
          <div className="media-feed">Media</div>
          {/* input media component */}
        </div>
      </div>
    );
  }
}
