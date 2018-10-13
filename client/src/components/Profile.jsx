import React, { Component } from 'react';
import axios from 'axios';
import { Mutation, Query} from 'react-apollo';
import gql from 'graphql-tag';
// import AlertFeed from './AlertFeed';

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      friends: [],
      homeLocation: null,
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
    const { name, picture, latitude, longitude } = this.props;
    const { userEmail, friendEmail, userId } = this.state

    // s
    
    // console.log(name, picture, latitude, longitude);

    const findFriend = gql`
    query findFriend( $friendEmail: String) {
      findFriend(email: $friendEmail) {
        id
        name
        email
      }
    }
    `;

    const findOrCreateFriendship = gql`
    mutation findOrCreateFriendship($userId: Int, $userEmail: String!, $friendEmail: String!) {
      findOrCreateFriendship(userId: $userId, userEmail: $userEmail, friendEmail: $friendEmail) {
        user
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
          <button type="button" className="location-button" onClick={() => this.setHome()}>Set Home</button>
        </div>
        {/* <div className="friend-feed">
          <AlertFeed latitude={latitude} longitude={longitude} />
        </div> */}
        <div className="friend-list">
          <h1>Friends</h1>
          <h2 className="ava-name">Nathan Vang</h2>
          <h3 className="ava-name">Minnesota</h3>
          <div className="friend-search">
            <Mutation mutation={findOrCreateFriendship} variables={{ userId, userEmail, friendEmail }}>
              {(mutate, { loading, error, data }) => {
                if (loading) return <p>Loading...</p>
                if (error) return <p>Error finding friend</p>
                return (
                  <div>
                    <input className="friend-search" placeholder="Search for friend by email address" onChange={e => this.friendSearchHandler(e)} />
                    <button type="button" onClick={mutate}>Add Friend</button>
                  </div>
                );
              }}
            </Mutation>
          </div>
          {/* <button type="button" className="friend-button" onClick={() => this.addFriend()}>Add Friend</button> */}
        </div>

        {/* <Query query={findFriend} variables={{ userEmail, friendEmail }}>

        </Query> */}
      </div>
    );
  }
}

export default Profile;
