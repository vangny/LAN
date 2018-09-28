import React from 'react';
import ReactDOM from 'react-dom';
import { Link, Router } from '@reach/router';

class App extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div className="header">
                <h1 className="title">Local Alert Network </h1>
                <div className="feed">
                    <h1>SEARCH</h1>
                    <h1>FEED</h1>
                </div>

                <div className="navigate">
                    <nav className="nav-items">
                        <button><Link to="/dashboard">Dashboard View </Link></button>
                        <button><Link to="/alert"> Report an Alert </Link></button>
                    </nav>
                </div>
                <Router>
                    <Dashboard path="/dashboard" />
                    <Alert path="/alert" />
                </Router>

            
            </div>
        );
    }
}

ReactDOM.render(<App />, document.getElementById('app'));