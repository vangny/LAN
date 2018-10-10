
import React from "react";
import ReactDOM from "react-dom";
import { Link, Router, navigate, Redirect } from "@reach/router";
import axios from "axios";
import moment from "moment";
import gql from 'graphql-tag';
// import {
  
// } from 'apollo-client';
import { ApolloProvider, InMemoryCache, HttpLink, ApolloClient, createNetworkInterface,
} from 'apollo-boost';
// const networkInterface = createNetworkInterface({
//   uri: 'http://localhost:9000/graphql'
// });
// const client = new ApolloClient({
//   uri: "http://localhost:3000/graphql"
// });

import React from 'react';
import ReactDOM from 'react-dom';
import { Link, Router, navigate } from '@reach/router';
import moment from 'moment';

import {
  ApolloProvider,
} from 'react-apollo';
import gql from 'graphql-tag';
// import {
  
// } from 'apollo-client';
import { InMemoryCache, HttpLink, ApolloClient, createNetworkInterface,
} from 'apollo-boost';
// const networkInterface = createNetworkInterface({
//   uri: 'http://localhost:9000/graphql'
// });
// const client = new ApolloClient({
//   uri: "http://localhost:3000/graphql"
// });


import Dashboard from "./components/Dashboard";
import Alert from "./components/alert/Alert";
import AlertOptions from "./components/alert/AlertOptions";
import AlertFeed from "./components/alert/AlertFeed";
import Login from './Login';

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
    };
    this.componentWillMount = this.componentWillMount.bind(this);
    this.handleAlertOptions = this.handleAlertOptions.bind(this);
    this.setLoginState = this.setLoginState.bind(this);
    this.renderLogin = this.renderLogin.bind(this);
  }

  componentWillMount() {
    navigator.geolocation.getCurrentPosition((position) => {
      localStorage.setItem('latitude', position.coords.latitude);
      localStorage.setItem('longitude', position.coords.longitude);
      this.setState({
        alerts: res.data,
      });
    });
  }

  handleAlertOptions(category) {
    const { latitude, longitude } = this.state;
    this.setState({
      category,
      timeStamp: moment().format(),
    }, () => {
      const { timeStamp } = this.state;

      client.query({
        query: gql`
        mutation FindOrCreateEvent($category: String, $timeStamp: Date, $latitude: Float, $longitude: Float) {
          findOrCreateEvent(category: $category, latitude: $latitude, longitude: $longitude, timeStamp: $timeStamp) {
            id
            category
          }
        }
        `
      }).then(event => console.log('event query results:', event));
  

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

  // Optional- Grab user data from local storage after login

  // componentDidMount() {
  //   const { name, picture } = this.state;
  //   let user = JSON.parse(sessionStorage.getItem('userData'));
  //   this.setState({
  //     name: user.name,
  //     picture: user.picture,
  //   });
  // }

  setLoginState() {
    const { isLoggedIn } = this.state;
    this.setState({
      isLoggedIn: true,
    });
  }

  renderLogin() {
  render() {
    
    const cache = new InMemoryCache();

    const client = new ApolloClient({
      uri: 'http://localhost:9000/graphql',
      link: new HttpLink(),
      cache,
    });
    // client.query({
    //   query: gql`
    //   {
    //     getAlerts(latitude:0, longitude:0, range:1000000) {
    //       category
    //     }
    //   }
    //   `
    // }).then(result => console.log('client query results:', result));

    const {
      latitude,
      longitude,
      category,
      timeStamp,
      EventId,
      isLoggedIn,
    } = this.state;

    return (!isLoggedIn)
      ? (
        <div>
          <Router>
            <Redirect noThrow from="/" to="/login" />
            <AlertFeed exact path="/" latitude={latitude} longitude={longitude} />
            <Login path="/login" login={this.setLoginState} />
          </Router>
        </div>
      )
      : (
    // console.log(this.state);
    
      <ApolloProvider client={client}>
      
        <div className="container">
          <Link to="/" className="title nav-cell">
            <h2>Local Alert Network</h2>
    return (

      <div className="container">
        <Link to="/" className="title nav-cell">
          <h2>Local Alert Network</h2>
        </Link>
        <Router className="content">
          <AlertFeed exact path="/" latitude={latitude} longitude={longitude} />
          <Dashboard path="/dashboard" latitude={latitude} longitude={longitude} />
          <Alert path="/alert" category={category} EventId={EventId} latitude={latitude} longitude={longitude} timeStamp={timeStamp} />
          <AlertOptions path="alertOptions" latitude={latitude} longitude={longitude} appContext={this} handleAlertOptions={this.handleAlertOptions} />
        </Router>
        <div className="nav-bar">
          <Link to="/" className="home-grid nav-cell">
            <span className="home-button">Home</span>
          </Link>
          <Router className="content">
            <Redirect noThrow from="/login" to="/" />
      <ApolloProvider client={client}>
      
        <div className="container">
          <Link to="/" className="title nav-cell">
            <h2>Local Alert Network</h2>
          </Link>
          <Router className="content">
            <AlertFeed exact path="/" latitude={latitude} longitude={longitude} />
            <Dashboard path="/dashboard" latitude={latitude} longitude={longitude} />
            <Alert path="/alert" category={category} EventId={EventId} latitude={latitude} longitude={longitude} timeStamp={timeStamp} />
            <AlertOptions path="alertOptions" latitude={latitude} longitude={longitude} appContext={this} handleAlertOptions={this.handleAlertOptions} />
          </Router>
          <div className="nav-bar">
            <Link to="/" className="home-grid nav-cell">
              <span className="home-button">Home</span>
            </Link>
            <Link to="/login" className="search-grid nav-cell">
              <span className="search-button">Login</span>
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
        </div>

      );
  }

  render() {
    return (
      <div>
        {this.renderLogin()}
      </div>

      </ApolloProvider>
    
  
    );
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
