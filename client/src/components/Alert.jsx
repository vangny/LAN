import React, { Component } from 'react';
import axios from 'axios';
import { navigate } from '@reach/router';

class Alert extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      notes: '',
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value,
    });
  }

  handleSubmit() {
    /* Insert emergency event type here */
    /* Insert geolocation data here */
    const { notes } = this.state;
    const alertData = { notes };
    axios.post('/alert/api/alerts', alertData)
      .then((res) => {
        console.log('alert sent to server', alertData);
        console.log(res);
      })
      .catch(err => console.log(err));
  }

  render() {
    const { notes } = this.state;
    const { latitude, longitude, category } = this.props;
    console.log(`category: ${category}\nlatitude: ${latitude}\nlongitude: ${longitude}`);
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
          <input type="text" name="notes" placeholder="Enter text here" onChange={this.handleChange} value={notes} />
        </div>
        <div className="submit">
          <button type="button" onClick={this.handleSubmit}>Submit</button>
        </div>
      </div>
    );
  }
}

export default Alert;
