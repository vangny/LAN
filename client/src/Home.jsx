import React from 'react';
import ReactDOM from 'react-dom';
import { navigate, Link, Router } from '@reach/router';
import Dashboard from './components/Dashboard.jsx';
import Alert from './components/Alert.jsx';

class Home extends React.Component {
    constructor(props) {
        super(props)
    }

    // queryTest() {
    //   var data = 'test passed!' 
      
    //   //top line (17) defines the type of argument your function will take in. the query field passes the argument into the function
    //   var query = `query Hello($data: String!) {
    //       hello(data: $data)
    //     }`;

    //   fetch('/graphql', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Accept': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     query,
    //     variables: { data }
    //   })
    //   })
    //   .then(r => r.json())
    //   .then(data => console.log('data returned:', data));
    // }

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
                        <button onClick={() => navigate('/alertOptions')}>Create Alert</button>
                    </ul>
                    </nav>
                </div>
            </div>
        );
    }
}

export default Home;