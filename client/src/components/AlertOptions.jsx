import React, { Component } from 'react';
import { navigate } from '@reach/router';

class AlertOptions extends React.Component {
  constructor(props) {
    super(props);
    const { latitude, longitude } = this.props;
    this.state = {
      latitude,
      longitude,
      category: null,
    }
    this.componentDidMount = this.componentDidMount.bind(this);
    this.sendDataToApp = this.sendDataToApp.bind(this);
  }

  componentDidMount() {
    navigator.geolocation.watchPosition((position) => {
      this.setState({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
      console.log(position.coords.latitude, position.coords.longitude);
    });
  }

  sendDataToApp(category) {
    const { appHandler } = this.props;
    const { latitude, longitude } = this.state;
    appHandler(category, latitude, longitude)
  }

  render() {
    const { latitude, longitude } = this.state;
    console.log(this.state);
    return (
      <div>
        <div>{`lat: ${latitude} long: ${longitude}`}</div>
        <h1>RED ALERT</h1>
        <button id="hurricane" type="button" value="hurricane" onClick={e => this.sendDataToApp(e.target.value)}>hurricane</button>
        <button id="flood" type="button" value="flood" onClick={e => this.sendDataToApp(e.target.value)}>flood</button>
        <button id="wildfire" type="button" value="wildfire" onClick={e => this.sendDataToApp(e.target.value)}>wildfire</button>
        <button id="earthquake" type="button" value="earthquake" onClick={e => this.sendDataToApp(e.target.value)}>earthquake</button>
      </div>
    );
  }
}
export default AlertOptions;
