import React from 'react';
import ReactDOM from 'react-dom';
import { navigate, Link, Router } from '@reach/router';
import Dashboard from './components/Dashboard.jsx';
import Alert from './components/Alert.jsx';

class Home extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div className="header">
                <div className="feed">
                    <h1>SEARCH</h1>
                    <h1>FEED</h1>
                </div>
                <div className="navigate">
                    <nav className="nav-items">
                    <ul>
                        <button onClick={() => navigate('/dashboard')}>Dashboard</button>
                        <button onClick={() => navigate('/alert')}>Create Alert</button>
                    </ul>
                    </nav>
                </div>
            </div>
        );
    }
}

export default Home;