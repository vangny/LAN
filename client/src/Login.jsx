import React, { Component } from 'react';
import ReactDOM from "react-dom";
import axios from 'axios';
import FacebookLogin from "react-facebook-login";
import GoogleLogin from "react-google-login";
import { Router, Link } from "@reach/router";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newLogin: false,
    };
    this.responseFacebook = this.responseFacebook.bind(this);
    this.responseGoogle = this.responseGoogle.bind(this);
    this.loginUser = this.loginUser.bind(this);
  }

  loginUser(res, type) {
    console.log('loginUser triggered');
    let userData;

    if (type === 'facebook' && res.email) {
      userData = {
        name: res.name,
        email: res.email,
        provider: type,
        provider_id: res.id,
        picture: res.picture.data.url,
        token: res.accessToken,
      };
    }
    if (type === 'google' && res.w3.U3) {
      console.log('google state triggered');
      userData = {
        name: res.w3.ig,
        email: res.w3.U3,
        provider: type,
        provider_id: res.El,
        picture: res.w3.Paa,
        token: res.Zi.access_token,
      };
    }

    if (userData) {
      const {
        name,
        email,
        provider,
        provider_id,
        picture,
        token } = userData;
      const { newLogin } = this.state;
      const query = `
    mutation FindOrCreateUser($name: String!, $email: String!, $provider: String!, $provider_id: String!, $picture: String!, $token: String!) {
      findOrCreateUser(name: $name, email: $email, provider: $provider, provider_id: $provider_id, picture: $picture, token: $token) {
        name
        picture
        token
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
            name, email, provider, provider_id, picture, token,
          },
        }),
      })
        .then(res => res.json())
        .then((userData) => {
          console.log('User data received from server!', userData);
          let resJSON = userData;
          console.log('local', resJSON);
          sessionStorage.setItem('userData', JSON.stringify(resJSON));
          this.setState({ newLogin: true });
          this.props.login();
        });
    }
  }

  responseFacebook(res) {
    console.log(res);
    this.loginUser(res, 'facebook');
  }

  responseGoogle(res) {
    console.log(res);
    this.loginUser(res, 'google');
  }

  render() {
    return (
      <div className="login-home">
        <div className="header">
          <h1>Local Alert Network</h1>
        </div>
        <div className="login-google">
          <GoogleLogin
            clientId="681417979790-t30qgb7rckeutkq0nu4t9vagskmncffk.apps.googleusercontent.com"
            buttonText="LOGIN WITH GOOGLE"
            onSuccess={this.responseGoogle}
            onFailure={this.responseGoogle}
          />
        </div>
        <br />
        <div className="login-face">
          <FacebookLogin
            appId="319558131933866"
            fields="name, email, picture"
            callback={this.responseFacebook}
          />
        </div>
      </div>

    );
  }
}

export default Login;
