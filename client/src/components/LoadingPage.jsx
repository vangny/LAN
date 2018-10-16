import React, { Component } from 'react';

import '../../main.css';

class LoadingPage extends Component {

  componentDidMount() {
    const { setCoordinates, load, fetchAlerts } = this.props;

    navigator.geolocation.getCurrentPosition((position) => {
      localStorage.setItem('latitude', position.coords.latitude);
      localStorage.setItem('longitude', position.coords.longitude);
      setCoordinates();
    });
  }

  render() {
    return (
      <div className="loading-container">
        <div className="logo">
          <img src={require('../../../icons/icon-384x384.png')} alt="" />
        </div>
        <div className="loading-page-loading">
          <span className="loading-dot">.</span>
          <span className="loading-dot">.</span>
          <span className="loading-dot">.</span>
          <span className="loading-dot">.</span>
          <span className="loading-dot">.</span>
        </div>
      </div>
    );
  }
  
};

export default LoadingPage;
