import React, { Component } from 'react';
import axios from 'axios';
import GetAlerts from '../getAlerts';

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      friends: [],
      homeLocation: null,
    };
  }

  render() {
    const { name, picture, latitude, longitude } = this.props;
    return (
      <div className="profile-layout">
        <h1 className="ava-header">My Alert Network</h1>
        <div className="avatar-card">
          <img className="avatar" src={this.props.picture} alt="avatar pic" />
          <h2 className="ava-name">{this.props.name}</h2>
        </div>
        <div className="friend-feed">
          <GetAlerts latitude={latitude} longitude={longitude} />
        </div>
        <div className="friend-list">
          <h1>Friends</h1>
          <h2 className="ava-name">Nathan Vang</h2>
          <h3 className="ava-name">Minnesota</h3>
          {/* <h2 className="ava-name">Nathan Vang</h2>
          <h3 className="ava-name">Minnesota!</h3> */}
          <button type="button" className="friend-button">Add Friend</button>
        </div>
      </div>
    );
  }
}

export default Profile;
