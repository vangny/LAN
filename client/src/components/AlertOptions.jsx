import React, { Component } from 'react';
import { Link, Router, navigate } from '@reach/router';
import moment from 'moment';
import Alert from './Alert';

class AlertOptions extends React.Component {
  constructor(props) {
    super(props);
    const { latitude, longitude } = this.props;
    this.state = {
      latitude,
      longitude,
      category: null,
      timeStamp: moment().format(),
    };
    this.componentDidMount = this.componentDidMount.bind(this);
    this.sendDataToApp = this.sendDataToApp.bind(this);
    // this.clickHandler = this.clickHandler.bind(this);
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
    const { latitude, longitude, timeStamp } = this.state;
    appHandler(category, latitude, longitude, timeStamp);
  }

  // clickHandler(category) {
  //   console.log(category);
  //   this.setState({ category });
  //   setTimeout(() => {
  //     navigate('/alert')
  //   }, 1000)
  //   navigate('alert');
  // };

  render() {
    const { latitude, longitude, category } = this.state;
    // console.log(this.state);
    const test = 'test';
    return (
      <div>
        <div>{`lat: ${latitude} long: ${longitude}`}</div>
        <Link to="alert" type="button">LINK TEST</Link>
        <button type="button" onClick={this.clickHandler}>test</button>
        <button id="hurricane" type="button" value="hurricane" onClick={e => navigate('alert', this.sendDataToApp(e.target.value))}>hurricane</button>
        <button id="flood" type="button" value="flood" onClick={e => navigate('alert', this.sendDataToApp(e.target.value))}>flood</button>
        <button id="wildfire" type="button" value="wildfire" onClick={e => navigate('alert', this.sendDataToApp(e.target.value))}>wildfire</button>
        <button id="earthquake" type="button" value="earthquake" onClick={e => navigate('alert', this.sendDataToApp(e.target.value))}>earthquake</button>
        <Router>
          <Alert path="/alert" latitude={latitude} longitude={longitude} category={category} test={test} />
        </Router>
      </div>

    );
  }
}
export default AlertOptions;
