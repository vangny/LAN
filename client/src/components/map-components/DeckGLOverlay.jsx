import React, { Component } from 'react';
import DeckGL, {ScatterplotLayer, HexagonLayer} from 'deck.gl';

const PICKUP_COLOR = [0, 128, 255];
const DROPOFF_COLOR = [255, 0, 128];

const HEATMAP_COLORS = [
  [213, 62, 79],
  [252, 141, 89],
  [254, 224, 139],
  [230, 245, 152],
  [153, 213, 148],
  [50, 136, 189]
].reverse();

const HEATMAP_COLORS = [
  [213, 62, 79],
  [252, 141, 89],
  [254, 224, 139],
  [230, 245, 152],
  [153, 213, 148],
  [50, 136, 189]
].reverse();

const LIGHT_SETTINGS = {
  lightsPosition: [-73.8, 40.5, 8000, -74.2, 40.9, 8000],
  ambientRatio: 0.4,
  diffuseRatio: 0.6,
  specularRatio: 0.2,
  lightsStrength: [0.8, 0.0, 0.8, 0.0],
  numberOfLights: 2
};

const elevationRange = [0, 1000];

export default class DeckGLOverlay extends Component {
  initialize(gl) {
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
  }

  render() {
    // if there is data
    if (!this.props.data) {
      return null;
    }

    const layers = [
      // if showHexagon is false then return a scatterplot layer instead
      !this.props.showHexagon ? new ScatterplotLayer({
        id: 'alert-scatter',
        getPosition: d => d.coordinates,
        getColor: d => d.pickup ? PICKUP_COLOR : DROPOFF_COLOR,
        getRadius: d=> 5,
        opacity: 0.5,
        pickable: true,
        radiusMinPixels: 0.25,
        radiusMaxPixels: 30,
        ...this.props,
      }) : null,
      // if showHexagon is true then return a hexagon layer
      this.props.showHexagon ? new HexagonLayer({
        id: 'alert',
        colorRange: HEATMAP_COLORS,
        elevationRange,
        elevationScale: 5,
        extruded: true,
        getPosition: d => d.coordinates,
        lightSettings: LIGHT_SETTINGS,
        opacity: 1,
        pickable: true,
        ...this.props
      }) : null
    ];

    return (<DeckGL
      {...this.props.viewport}
      layers={layers}
      onWebGLInitialized={this.initialize}
    />);
  }
}