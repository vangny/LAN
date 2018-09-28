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
            <h1>SEARCH</h1>
            <h1>FEED</h1>

            <nav>
                <button>Dashboard View </button>
                <button> Report an Alert </button>
            </nav>
            
            </div>
        );
    }
}

ReactDOM.render(<App />, document.getElementById('app'));