import React, { Component } from 'react';
import ReactDOM from "react-dom";
import FacebookLogin from "react-facebook-login";
import GoogleLogin from "react-google-login";
import { Router, Link } from "@reach/router";



class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userID: '',
      name: '',
      email: '',
      picture: '',
    };
    this.responseFacebook = this.responseFacebook.bind(this);
    this.responseGoogle = this.responseGoogle.bind(this);
  }

  responseFacebook(res) {
    console.log(res);

    this.setState({
      userID: res.userID,
      name: res.name,
      email: res.email,
      picture: res.picture.data.url,
    });
  }

  responseGoogle(res) {
    console.log(res);

    this.setState({
      userID: res.googleId,
      name: res.name,
      email: res.email,
      picture: res.imageUrl,
    }, () => {
      this.props.login()
    })

  }

  render() {
    return (
      <div className="login-home">
        <h1>Welcome! Please login below</h1>
        <FacebookLogin
          appId="319558131933866"
          fields="name, email, picture"
          callback={this.responseFacebook}
        />
        <br />
        <GoogleLogin
          clientId="681417979790-t30qgb7rckeutkq0nu4t9vagskmncffk.apps.googleusercontent.com"
          buttonText="LOGIN WITH GOOGLE"
          onSuccess={this.responseGoogle}
          onFailure={this.responseGoogle}
        />
      </div>

    );
  }
}

export default Login;
// ReactDOM.render(<Login />, document.getElementById('app'));
