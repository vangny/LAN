import React, { Component } from 'react';
import Map from './map-components/Map.jsx';

export default class Dashboard extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { latitude, longitude } = this.props;
    return (
      <div className='dashboard'>
        <div className='map-container' id='map-container'>
          <Map latitude={latitude} longitude={longitude}/>
        </div>
        <div className='alerts-container'>
            alerts
          {/* input alerts component */}
        </div>
        <div className='media-container'>
          media
          {/* input media component */}
        </div>
      </div>
    );
  }
}