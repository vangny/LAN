import React, { Component } from 'react';
import MapGL from 'react-map-gl';

import DeckGL from './DeckGL';
import LayerControls from 'LayerControls.jsx';
// import sample from '../../../sampleData.js';

const MAPBOX_STYLE = 'mapbox://styles/mapbox/dark-v9';
// will need to do a get request in the future so the token isn't vulnerable
const MAPBOX_TOKEN = 'pk.eyJ1IjoidmFuZ255IiwiYSI6ImNqbWltMncxbTA2ZHgzcHF6bzBjYmxqbHkifQ.iTJHeAl1MKNibdVNZU0MJQ';


export default class Map extends Component {
  constructor(props) {
    super(props);
    this.state = {
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight,
        //coordinates centralized to SF for now
        longitude: -122.4194,
        latitude: 37.7,
        zoom: 11,
        maxZoom: 16,
      },
      settings: {
        ...Object.keys(SCATTERPLOT_CONTROL).reduce((accu, key) => ({
          ...accu,
          [key]: SCATTERPLOT_CONTROLS[key].value
        }), {}),

        ...Object.keys(HEXAGON_CONTROLS).reduce((accu, key) => ({
          ...accu,
          [key]: HEXAGON_CONTROLS[key].value
        }), {})
      },
    }
    this.resizeMap = this.resizeMap.bind(this);
  }

  componentDidMount() {
    window.addEventListener('resize', this.resizeMap);
    this.resizeMap();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeMap);
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
        <LayerControls 
          settings={this.state.settings}
          propTypes={HEXAGON_CONTROLS}
          onChange={settings => this.updateLayerSettings(settings)}
        />
        <MapGL
          {...this.state.viewport}
          mapStyle={MAPBOX_STYLE}
          onViewportChange={viewport => this.onWindowChange(viewport)}
          mapboxApiAccessToken={MAPBOX_TOKEN}
        >
        <DeckGL 
          viewport={this.state.viewport}
          data
        />
        </MapGL>
      </div>
    );
  }
}