import React from 'react';
import ReactDOM from 'react-dom';
import { Link, Router } from '@reach/router';
import Dashboard from './components/Dashboard.jsx';
import Alert from './components/Alert.jsx';
import Home from './Home.jsx';


const App = () => (
  <div className="header">
    <Link to="/">
      <h1 className="title">Local Alert Network </h1>
    </Link>
    <Router>
      <Home exact path="/" />
      <Dashboard path="/dashboard" />
      <Alert path="/alert" />
    </Router>
  </div>
);

ReactDOM.render(<App />, document.getElementById('app'));