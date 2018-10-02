import React from 'react';
import ReactDOM from 'react-dom';
import { Link, Router, navigate } from '@reach/router';
import axios from 'axios';
import moment from 'moment';

import Dashboard from './components/Dashboard';
import Alert from './components/Alert';
import AlertOptions from './components/AlertOptions';
import Home from './Home';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      latitude: 'Loading...',
      longitude: 'Loading...',
      category: null,
      timeStamp: null,
      EventID: null,
    };
    this.componentDidMount = this.componentDidMount.bind(this);
    this.handleAlertOptions = this.handleAlertOptions.bind(this);
  }

  componentDidMount() {
    navigator.geolocation.getCurrentPosition((position) => {
      this.setState({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      }, () => {
        console.log('Initial coordinates: ', position.coords.latitude, position.coords.longitude);
      });
    });
  }

  handleAlertOptions(category) {
    const timeStamp = moment().format();
    this.setState({
      category,
      timeStamp,
    }, () => {
      axios.post('/alert/api/events', this.state)
        .then((res) => {
          console.log('receiving event data: ', res.data);
          this.setState({ EventID: res.data.id },
            () => {
              navigate('/alert');
            });
        });
    });
  }

  render() {
    const {
      latitude,
      longitude,
      category,
      timeStamp,
      EventID,
    } = this.state;
    // console.log(this.state);
    return (
      <div className="header">
        <Link to="/">
          <h1 className="title">Local Alert Network </h1>
        </Link>
        <Router>
          <Home exact path="/" />
          <Dashboard path="dashboard" />
          <AlertOptions path="alertOptions" latitude={latitude} longitude={longitude} appHandler={this.appHandler} appContext={this} handleAlertOptions={this.handleAlertOptions}/>
          <Alert path="alert" category={category} latitude={latitude} longitude={longitude} timeStamp={timeStamp} EventID={EventID} />
        </Router>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
