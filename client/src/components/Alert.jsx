import React, { Component } from 'react';

class Alert extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      notes: '',
    };
  }

  render() {
    return (
      <div className="container">
        <div className="head">
        </div>
        <div className="location-info">
          <h1>Location Data Here</h1>
          <h1>Type of Emergency Here</h1>
        </div>
        <div className="photo">
          <button onClick={() => navigate('/')}>Capture Photo</button>
        </div>
        <div className="notes">
          <button onClick={() => navigate('/')}>Notes</button>
        </div>
        <div className="submit">
          <button onClick={() => navigate('/')}>Submit</button>
        </div>
      </div>
    );
  }
}

export default Alert;
