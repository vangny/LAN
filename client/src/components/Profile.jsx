import React, { Component } from 'react';
import axios from 'axios';

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      friends: [],
      homeLocation: null,
    };
  }

  render() {
    const { name, picture } = this.props;
    return (
      <div className="profile-layout">
        <h1 className="ava-header">User Profile</h1>
        <div className="avatar-card">
          <img className="avatar" src={this.props.picture} alt="avatar pic" />
          <h2 className="ava-name">{this.props.name}</h2>
        </div>
        <div className="friend-feed">
          <h1>FRIEND ALERT FEED HERE</h1>
        </div>
        <div className="friend-list">
          <h1>FRIENDS LIST HERE</h1>
          <button type="button">Add Friend</button>
        </div>
      </div>
    );
  }
}

export default Profile;
