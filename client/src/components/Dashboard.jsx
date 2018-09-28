import React, { Component } from 'react';


export default class Dashboard extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div>
        <div id='map'>
          <Map />
        </div>
        <div id='media'>
          {/* input media component */}
        </div>
        <div id='alerts'>
          {/* input alerts component */}
        </div>
      </div>
    );
  }
}