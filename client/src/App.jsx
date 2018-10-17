import React from 'react';
import ReactDOM from 'react-dom';
import { Link, Router, navigate, Redirect } from '@reach/router';
// import axios from "axios";
import moment from 'moment';
import { ApolloProvider } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { split } from 'apollo-link';
import { WebSocketLink } from 'apollo-link-ws';
import { getMainDefinition } from 'apollo-utilities';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import Loadable from 'react-loadable';
// import gql from 'graphql-tag';

import Dashboard from './components/Dashboard';
// import Alert from './components/create-alert/Alert';
// import AlertOptions from './components/create-alert/AlertOptions';
import AlertFeed from './components/AlertFeed';
import Login from './Login';
import LoadingPage from './components/LoadingPage';
// import Profile from './components/Profile';
// import Map from './components/map/Map';
import Modal from './components/create-alert/modal';
import Settings from './components/Settings';
import '../main.css';

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

const Alert = Loadable({
  loader: () => import('./components/create-alert/Alert'),
  loading: () => <div>Loading...</div>,
});

const AlertOptions = Loadable({
  loader: () => import('./components/create-alert/AlertOptions'),
  loading: () => <div>Loading...</div>,
});

const Profile = Loadable({
  loader: () => import('./components/Profile'),
  loading: () => <div>Loading...</div>,
});

const Map = Loadable({
  loader: () => import('./components/map/Map'),
  loading: () => <div>Loading...</div>,
});

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      latitude: Number(localStorage.getItem('latitude')),
      longitude: Number(localStorage.getItem('longitude')),
      category: null,
      timeStamp: null,
      EventId: null,
      isLoggedIn: JSON.parse(sessionStorage.getItem('loggedIn')),
      name: sessionStorage.getItem('user'),
      picture: sessionStorage.getItem('picture'),
      email: sessionStorage.getItem('email'),
      userId: sessionStorage.getItem('id'),
      isLoaded: false,
      showSettings: false,
      filter: localStorage.getItem('filter') ||'none',
      range: Number(localStorage.getItem('range')) || 10,
    };
    // this.componentDidMount = this.componentDidMount.bind(this);
    this.handleAlertOptions = this.handleAlertOptions.bind(this);
    this.setLoginState = this.setLoginState.bind(this);
    this.setCoordinates = this.setCoordinates.bind(this);
    this.setLoadedState = this.setLoadedState.bind(this);
    this.handleInitialStartup = this.handleInitialStartup.bind(this);
    this.handleSettings = this.handleSettings.bind(this);
    this.renderSettings = this.renderSettings.bind(this);
    this.changeSettings = this.changeSettings.bind(this);
    this.logOut = this.logOut.bind(this);
  }

  // componentDidMount() {
  //   client.resetStore();
  //   console.log('Client cache: ', client.cache.data.data);
  // }
  setLoginState() {
    const user = JSON.parse(sessionStorage.userData);
    const userName = user.data.findOrCreateUser.name;
    const userPic = user.data.findOrCreateUser.picture;
    const userEmail = user.data.findOrCreateUser.email;
    const userId = Number(user.data.findOrCreateUser.id);
    sessionStorage.setItem('user', userName);
    sessionStorage.setItem('picture', userPic);
    sessionStorage.setItem('email', userEmail);
    sessionStorage.setItem('id', userId);
    console.log('app userId', userId);
    this.setState({
      isLoggedIn: true,
      name: userName,
      picture: userPic,
      email: userEmail,
      userId,
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

  logOut() {
    sessionStorage.removeItem('loggedIn');
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('picture');
    sessionStorage.removeItem('email');
    this.setState({ isLoggedIn: false });
    navigate('/');
  }

  changeSettings(filter, range) {
    localStorage.setItem('filter', filter);
    localStorage.setItem('range', Number(range));
    this.setState({
      filter,
      range,
    }, () => this.handleSettings());
  }

  handleInitialStartup() {
    const { isLoggedIn, isLoaded } = this.state;
    if (!isLoggedIn) {
      return (
        <div>
          <Router>
            <Redirect noThrow from="/" to="/login" />
            <LoadingPage path="/" load={this.setLoadedState} />
            <Login path="/login" login={this.setLoginState} />
          </Router>
        </div>
      );
    }
    if (!isLoaded) {
      return (
        <div>
          <Router>
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
    // if (confirm(`Please confirm that you want to create a(n) ${category.toUpperCase()} alert`)) {
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
    // }
  }

  handleSettings() {
    const { showSettings } = this.state;
    this.setState({
      showSettings: !showSettings,
    });
  }

  renderSettings() {
    const { showSettings, range } = this.state;
    return showSettings ? (
      <Modal>
        <Settings
          handleSettings={this.handleSettings}
          currentRange={range}
          changeSettings={this.changeSettings}
        />
      </Modal>
    ) : null;
  }

  render() {
    const {
      latitude,
      longitude,
      category,
      EventId,
      isLoggedIn,
      isLoaded,
      name,
      picture,
      email,
      range,
      filter,
      userId
    } = this.state;
    console.log(name, picture, email);
    /* eslint-disable */
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
            <Dashboard path="/" client={client} latitude={latitude} longitude={longitude} range={range} filter={filter} />
            <Map path="/map" latitude={latitude} longitude={longitude} />
            <AlertOptions path="alertOptions" latitude={latitude} longitude={longitude} appContext={this} handleAlertOptions={this.handleAlertOptions} />
            <Profile path="/profile" logOut={this.logOut} latitude={latitude} longitude={longitude} name={name} picture={picture} email={email} />
            <Alert path="/alert" category={category} latitude={latitude} longitude={longitude} name={name} EventId={Number(EventId)} userId={userId}/>
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
          {this.renderSettings()}
          <div to="/" className="header nav-cell">
            <div className="header-icon" >
              <img src={require('../../icons/logo/icon-72x72.png')} alt="" />
            </div>
            <div className="header-title">
              <span>Local Alert Network</span>
            </div>
            <div className="header-settings">
              <button type="button" onClick={() => this.handleSettings()}>
                <i className="fas fa-cog "></i>
              </button>
            </div>
          </div>
          <Router className="content" id="content">
            <Redirect noThrow from="/login" to="/" />
            {/* <GetAlerts exact path="/" latitude={latitude} longitude={longitude} /> */}
            <AlertFeed exact path="/" client={client} latitude={latitude} longitude={longitude} range={range} filter={filter} />
            <Map path="/map" latitude={latitude} longitude={longitude} />
            <AlertOptions path="alertOptions" latitude={latitude} longitude={longitude} appContext={this} handleAlertOptions={this.handleAlertOptions} />
            <Profile path="/profile" name={name} picture={picture}latitude={latitude} longitude={longitude} email={email} logOut={this.logOut} />
            <Alert path="/alert" category={category} latitude={latitude} longitude={longitude} name={name} EventId={Number(EventId)} userId={userId} />
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
/* eslint-enable */
// ReactDOM.render(<App />, document.getElementById('app'));
ReactDOM.render(
  <ApolloProvider client={client}>
    <App client={client} />
  </ApolloProvider>,
  document.getElementById('app'),
);
