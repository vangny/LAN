import React, { Component } from 'react';
import MapGL from 'react-map-gl';

import DeckGL from './DeckGL';
import sample from '../../sampleData.js'

export default class Map extends Component {
  constructor(props) {
    super(props);
    this.state = {
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight,
        longitude: -74,
        latitude: 40.7,
        zoom: 11,
        maxZoom: 16,
      },
    }
  }

  onWindowChange(viewport) {
    const { width, height } = viewport;
    this.setState({
      viewport: {...this.state.viewport, ...viewport}
    });
  }

  resizeMap() {
    this.onWindowChange({
      width: window.innerWidth * .50,
      height: window.innerHeight * .50,
    });
  }

  render() {
    return (
      <div>
        <MapGL>

        </MapGL>
      </div>
    );
  }
}