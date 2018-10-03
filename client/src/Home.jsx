import React from 'react';
import ReactDOM from 'react-dom';
import { navigate, Link, Router } from '@reach/router';
import moment from 'moment';
import axios from 'axios';
import Dashboard from './components/Dashboard.jsx';
import Alert from './components/Alert.jsx';

const Home = ({ alerts }) => {
  const alertFeed = () => {
    return alerts ? alerts.map(alert => (
      <div className="alert" key={alert.id}>
        {`Category: ${alert.category}`}
        <br/>
        {moment(alert.createdAt).fromNow()}
      </div>
    )) : (<p>Loading feed...</p>);
  }

  return (
    <div className="header">
      <div className="feed">
        <h1>SEARCH</h1>
        <h1>FEED</h1>
        <div id="alertFeed">
          {alertFeed()}
        </div>
      </div>
    </div>
  );
}



export default Home;
