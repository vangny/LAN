import React, { Component } from 'react';
import axios from 'axios';
import { Mutation, Query} from 'react-apollo';
import gql from 'graphql-tag';
// import AlertFeed from './AlertFeed';

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // homeLocation: null,
      userEmail: JSON.parse(sessionStorage.getItem('userData')).data.findOrCreateUser.email,
      userId: Number(JSON.parse(sessionStorage.getItem('userData')).data.findOrCreateUser.id),
      friendEmail: null,
    };
    this.setHome = this.setHome.bind(this);
    // this.addFriend = this.addFriend.bind(this);
    this.friendSearchHandler = this.friendSearchHandler.bind(this);
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

  friendSearchHandler(e) {
    this.setState({
      friendEmail: e.target.value,
    });
  }

  // addFriend() {
  //   console.log('Checking if user exists...');
    
  // }
  
  render() {
    const { name, picture, logOut } = this.props;
    const { userEmail, friendEmail, userId } = this.state

    // s
    
    // console.log(name, picture, latitude, longitude);

    const friends = gql`
    query friends( $userId: Int) {
      friends(userId: $userId) {
        name
        picture
      }
    }
    `;

    const findOrCreateFriendship = gql`
    mutation findOrCreateFriendship($userId: Int, $userEmail: String!, $friendEmail: String!) {
      findOrCreateFriendship(userId: $userId, userEmail: $userEmail, friendEmail: $friendEmail) {
        user1
        user2
        new
      }
    }
    `;
    // const userEmail = JSON.parse(sessionStorage.getItem('userData')).email;
    return (
      <div className="profile-layout">
        <h1 className="ava-header">My Alert Network</h1>
        <div className="avatar-card">
          <img className="avatar" src={picture} alt="avatar pic" />
          <h2 className="ava-name">{name}</h2>
          <button type="button" className="location-button" onClick={() => this.setHome()} />
          <button type="button" className="logOut-button" onClick={logOut}>
          Log Out
          </button>
        </div>
        {/* <div className="friend-feed">
          <AlertFeed latitude={latitude} longitude={longitude} />
        </div> */}
        <div className="friends">
          
          <div>
            <Mutation mutation={findOrCreateFriendship} variables={{ userId, userEmail, friendEmail }}>
              {(mutate, { loading, error }) => {
                if (loading) return <p>Loading...</p>;
                if (error) {
                  return (
                    <div className="friend-search">
                      <p>Error: Email address not found</p>
                      <input className="friend-search" placeholder="Search by email" onChange={e => this.friendSearchHandler(e)} />
                      <button
                        className="friend-button"
                        type="button" 
                        onClick={() => {
                          mutate();
                        }}
                      >
                      Add Friend
                      </button>
                    </div>
                  );
                }
                return (
                  <div>
                    <div className="search-div">
                      <input className="friend-search" placeholder="Search by email" onChange={e => this.friendSearchHandler(e)} />
                      <button className="friend-button" type="button" onClick={mutate}>Add Friend</button>
                    </div>
                    <h1 className="friend-title">Friends</h1>
                  </div>
                );
              }}
            </Mutation>
          </div>
          <div className="friend-list">
            <Query query={friends} variables={{ userId }}>
              {({ data, error, loading }) => {
                if (loading) return <p>Loading...</p>;
                if (error) return <p>Error getting friend list</p>;
                return (data.friends.map(friend => (
                  <div>
                    <div key={Math.random() * 1000000000000} className="friend">
                      <img className="friend-avatar" alt="friend avatar" src={friend.picture} />
                      <span className="friend-text">{friend.name}</span>
                    </div>
                  </div>
                )));
              }}
            </Query>
          </div>
        </div>
      </div>
    );
  }
}

export default Profile;
