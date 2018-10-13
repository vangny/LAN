import React, { Component } from 'react';
import axios from 'axios';
import AlertFeed from './AlertFeed';

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      friends: [],
      homeLocation: null,
    };
    this.setHome = this.setHome.bind(this);
  }

  setHome() {
    const { latitude, longitude, email } = this.props;
    let homeLat = latitude;
    let homeLong = longitude;
    const query = `
    mutation SetHome($email: String!, $homeLat: Float!, $homeLong: Float!) {
      setHome(email: $email, latitude: $homeLat, longitude: $homeLong) {
        email
      }
    }
    `;
    fetch('/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        query,
        variables: {
          email, homeLat, homeLong,
        },
      }),
    })
      .then(res => res.json())
      .then((homeSet) => {
        console.log('Home location has been set!', homeSet);
      });
  }

  render() {
    const { name, picture, latitude, longitude } = this.props;
    return (
      <div className="profile-layout">
        <h1 className="ava-header">My Alert Network</h1>
        <div className="avatar-card">
          <img className="avatar" src={this.props.picture} alt="avatar pic" />
          <h2 className="ava-name">{this.props.name}</h2>
          <button type="button" className="location-button" onClick={() => this.setHome()}>Set Home</button>
        </div>
        {/* <div className="friend-feed">
          <AlertFeed latitude={latitude} longitude={longitude} />
        </div> */}
        <div className="friend-list">
          <h1>Friends</h1>
          <h2 className="ava-name">Nathan Vang</h2>
          <h3 className="ava-name">Minnesota</h3>
         
          <button type="button" className="friend-button" onClick={() => this.setHome()}>Add Friend</button>
        </div>
      </div>
    );
  }
}

export default Profile;
