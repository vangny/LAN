import React from 'react';
import ReactDOM from 'react-dom';
import { Link, Router, navigate } from '@reach/router';
import axios from 'axios';

import Dashboard from './components/Dashboard.jsx';
import Alert from './components/Alert.jsx';
import AlertOptions from './components/AlertOptions.jsx'
import Home from './Home.jsx';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      latitude: 'Loading...',
      longitude: 'Loading...',
      category: null,
      timeStamp: null,
    };
    this.appHandler = this.appHandler.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
  }

  componentDidMount() {
    navigator.geolocation.getCurrentPosition((position) => {
      this.setState({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
      // console.log(position.coords.latitude, position.coords.longitude)
    });
  }

  appHandler(category, latitude, longitude, timeStamp) {
    this.setState({
      latitude,
      longitude,
      category,
      timeStamp,
    }, () => {
      axios.post('/alert/api/events', this.state);
    });

    navigate('/alert');
  }

  render() {
    const { latitude, longitude, category } = this.state;
    // console.log(this.state);
    return (
      <div className="header">
        <Link to="/">
          <h1 className="title">Local Alert Network </h1>
        </Link>
        <Router>
          <Home exact path="/" />
          <Dashboard path="/dashboard" />
          <Alert path="/alert" category={category} latitude={latitude} longitude={longitude} />
          <AlertOptions path="/alertOptions" latitude={latitude} longitude={longitude} appHandler={this.appHandler} />
        </Router>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
