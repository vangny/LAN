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
      EventId: null,
      alerts: null,
    };
    this.componentDidMount = this.componentDidMount.bind(this);
    this.handleAlertOptions = this.handleAlertOptions.bind(this);
    this.sendAlertsToApp = this.sendAlertsToApp.bind(this);
  }

  componentDidMount() {
    axios.get('/home')
      .then((res) => {
        this.setState({
          alerts: res.data,
        });
      });

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
          this.setState({ EventId: res.data.id },
            () => {
              navigate('/alert');
            });
        });
    });
  }

  sendAlertsToApp(alerts) {
    this.setState({ alerts }, () => {
      navigate('/');
    });
  }

  render() {
    const {
      latitude,
      longitude,
      category,
      timeStamp,
      EventId,
      alerts,
    } = this.state;
    // console.log(this.state);
    return (
      <div className='container'>
        {/* <Link to="/" className="menu"><span class="fas fa-bars"></span></Link> */}
        <Link to="/" className="title nav-cell">
          <h2>Local Alert Network</h2>
        </Link>
        <div className="content">
          <Router>
            <Home exact path="/" alerts={alerts} />
            <Dashboard path="/dashboard" />
            <Alert path="/alert" category={category} EventId={EventId} latitude={latitude} longitude={longitude} timeStamp={timeStamp} sendAlertsToApp={this.sendAlertsToApp} />
            <AlertOptions path="alertOptions" latitude={latitude} longitude={longitude} appContext={this} handleAlertOptions={this.handleAlertOptions}/>
          </Router>
        </div>
        <Link to="/" className="home-grid nav-cell">
          <span className="home-button">Home</span>
        </Link>
        <div className="search-grid nav-cell">
          <span className="search-button">Search</span>
        </div>
        <Link to="/alertOptions" className="alert-grid nav-cell">
          <span className="alert-button">Add Alert</span>
        </Link>
        <Link to="/dashboard" className="dash-grid nav-cell">
          <span className="dash-button">Dashboard</span>
        </Link>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
