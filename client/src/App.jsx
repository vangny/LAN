import React from "react";
import ReactDOM from "react-dom";
import { Link, Router, navigate, Redirect } from "@reach/router";
// import axios from "axios";
import moment from "moment";
import { ApolloProvider } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { split } from 'apollo-link';
import { WebSocketLink } from 'apollo-link-ws';
import { getMainDefinition } from 'apollo-utilities';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
// import gql from 'graphql-tag';

import Dashboard from './components/Dashboard';
import Alert from './components/create-alert/Alert';
import AlertOptions from './components/create-alert/AlertOptions';
import AlertFeed from './components/AlertFeed';
import Login from './Login';
import LoadingPage from './components/LoadingPage';
import Profile from './components/Profile';
import Map from './components/map/Map';
import GetAlerts from './getAlerts';

const httpLink = new HttpLink({ uri: '/graphql' });

const wsLink = new WebSocketLink({
  uri: `ws://${location.host}/subscriptions`,
  options: {
    reconnect: true,
  },
});

const link = split(
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query);
    return kind === 'OperationDefinition' && operation === 'subscription';
  },
  wsLink,
  httpLink,
);

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link,
});

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      latitude: Number(localStorage.getItem('latitude')) || 'Loading...',
      longitude: Number(localStorage.getItem('longitude')) || 'Loading...',
      category: null,
      timeStamp: null,
      EventId: null,
      alerts: null,
      isLoggedIn: false,
      name: '',
      picture: '',
      isLoaded: false,
    };
    // this.componentWillMount = this.componentWillMount.bind(this);
    this.handleAlertOptions = this.handleAlertOptions.bind(this);
    this.setLoginState = this.setLoginState.bind(this);
    this.setCoordinates = this.setCoordinates.bind(this);
    this.setLoadedState = this.setLoadedState.bind(this);
    this.handleInitialStartup = this.handleInitialStartup.bind(this);
  }

  // componentWillMount() {
  //   navigator.geolocation.getCurrentPosition((position) => {
  //     localStorage.setItem('latitude', position.coords.latitude);
  //     localStorage.setItem('longitude', position.coords.longitude);
  //     this.setState({ isLoaded: true }, () => (console.log('loaded')));
  //   });
  // }

  setLoginState() {
    let { name, picture } = this.state;
    let obj = JSON.parse(sessionStorage.userData);
    let userName = obj.data.findOrCreateUser.name;
    let userPic = obj.data.findOrCreateUser.picture;
    this.setState({
      isLoggedIn: true,
      name: userName,
      picture: userPic,
    });
  }

  setCoordinates() {
    this.setState({
      latitude: Number(localStorage.getItem('latitude')),
      longitude: Number(localStorage.getItem('longitude')),
    }, () => this.setLoadedState());
  }

  setLoadedState() {
    this.setState({
      isLoaded: true,
    });
  }

  handleInitialStartup() {
    const { isLoggedIn, isLoaded } = this.state;

    if (!isLoggedIn) {
      return (
        <div>
          <Router>
            <Redirect noThrow from="/" to="/login" />
            {/* <AlertFeed exact path="/" latitude={latitude} longitude={longitude} /> */}
            <LoadingPage path="/" load={this.setLoadedState}  />
            <Login path="/login" login={this.setLoginState} />
          </Router>
        </div>
      );
    }
    if (!isLoaded) {
      return (
        <div>
          <Router>
            {/* <Redirect noThrow from="/" to="/login" />
            <AlertFeed exact path="/" latitude={latitude} longitude={longitude} /> */}
            <Redirect noThrow from="/login" to="/" />
            <LoadingPage path="/" setCoordinates={this.setCoordinates} load={this.setLoadedState} />
          </Router>
        </div>
      );
    }
    return null;
  }

  handleAlertOptions(category) {
    const { latitude, longitude } = this.state;
    this.setState({
      category,
      timeStamp: moment().format(),
    }, () => {
      const { timeStamp } = this.state;

      const query = `
      mutation FindOrCreateEvent($category: String, $timeStamp: Date, $latitude: Float, $longitude: Float) {
        findOrCreateEvent(category: $category, latitude: $latitude, longitude: $longitude, timeStamp: $timeStamp) {
          id
          category
        }
      }`;
      fetch('/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          query,
          variables: {
            latitude, longitude, category, timeStamp,
          },
        }),
      })
        .then(response => response.json())
        .then((event) => {
          console.log('Alert will be attached to this event: ', event.data.findOrCreateEvent);
          this.setState({ EventId: Number(event.data.findOrCreateEvent.id) });
          navigate('/alert');
        });
    });
  }

  render() {

    const {
      latitude,
      longitude,
      category,
      timeStamp,
      EventId,
      isLoggedIn,
      isLoaded,
      name,
      picture,
    } = this.state;
    return (!isLoggedIn || !isLoaded)
      ? (
        this.handleInitialStartup()
      )
      : window.innerWidth >= 1200 ? (
        <div className="container">
          <Link to="/" className="title nav-cell">
            <h2>Local Alert Network</h2>
          </Link>
          <Router className="content" id="content">
            <Redirect noThrow from="/login" to="/" />
            <Dashboard path="/" latitude={latitude} longitude={longitude} />
            <Map path="/map" latitude={latitude} longitude={longitude} />
            <AlertOptions path="alertOptions" latitude={latitude} longitude={longitude} appContext={this} handleAlertOptions={this.handleAlertOptions} />
            <Profile path="/profile" latitude={latitude} longitude={longitude} name={name} picture={picture} />
            <Alert path="/alert" category={category} latitude={latitude} longitude={longitude} name={name} EventId={Number(EventId)}/>
          </Router>
          <div className="nav-bar">
            <Link to="/" className="home-grid nav-cell">
              <span className="home-button">Home</span>
            </Link>
            <Link to="/alertOptions" className="alert-grid nav-cell">
              <span className="alert-button">Add Alert</span>
            </Link>
            <Link to="/profile" className="search-grid nav-cell">
              <span className="profile-button">Profile</span>
            </Link>
            <Link to="/map" className="dash-grid nav-cell">
              <span className="settings-button">Map</span>
            </Link>
          </div>
        </div>
      ) : (
        <div className="container">
          <Link to="/" className="title nav-cell">
            <h2>Local Alert Network</h2>
          </Link>
          <Router className="content" id="content">
            <Redirect noThrow from="/login" to="/" />
            {/* <GetAlerts exact path="/" latitude={latitude} longitude={longitude} /> */}
            <AlertFeed exact path="/" latitude={latitude} longitude={longitude} />
            <Map path="/map" latitude={latitude} longitude={longitude} />
            <AlertOptions path="alertOptions" latitude={latitude} longitude={longitude} appContext={this} handleAlertOptions={this.handleAlertOptions} />
            <Profile path="/profile" name={name} picture={picture}latitude={latitude} longitude={longitude}/>
            <Alert path="/alert" category={category} latitude={latitude} longitude={longitude} name={name} EventId={Number(EventId)} />
          </Router>
          <div className="nav-bar">
            <Link to="/" className="home-grid nav-cell">
              <span className="home-button">Home</span>
            </Link>
            <Link to="/alertOptions" className="alert-grid nav-cell">
              <span className="alert-button">Add Alert</span>
            </Link>
            <Link to="/profile" className="search-grid nav-cell">
              <span className="profile-button">Profile</span>
            </Link>
            <Link to="/map" className="dash-grid nav-cell">
              <span className="settings-button">Map</span>
            </Link>
          </div>
        </div>
      );
  }
}

// ReactDOM.render(<App />, document.getElementById('app'));
ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById('app'),
);
