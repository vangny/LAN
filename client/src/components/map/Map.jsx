import React, { Component } from 'react';
import MapGL from 'react-map-gl';
import axios from 'axios';

import { LayerControls, HEXAGON_CONTROLS, SCATTERPLOT_CONTROLS } from './LayerControls.jsx';
import DeckGLOverlay from './DeckGLOverlay';

const MAPBOX_STYLE = 'mapbox://styles/mapbox/dark-v9';
// will need to do a get request in the future so the token isn't vulnerable
const MAPBOX_TOKEN = 'pk.eyJ1IjoidmFuZ255IiwiYSI6ImNqbWltMncxbTA2ZHgzcHF6bzBjYmxqbHkifQ.iTJHeAl1MKNibdVNZU0MJQ';

export default class Map extends Component {
  constructor(props) {
    super(props);

    const { latitude, longitude } = this.props;

    this.state = {
      viewport: {
        width: 0,
        height: 0,
        longitude,
        latitude,
        zoom: 14,
        maxZoom: 18,
      },
      settings: {
        ...Object.keys(SCATTERPLOT_CONTROLS).reduce((accu, key) => ({
          ...accu,
          [key]: SCATTERPLOT_CONTROLS[key].value,
        }), {}),

        ...Object.keys(HEXAGON_CONTROLS).reduce((accu, key) => ({
          ...accu,
          [key]: HEXAGON_CONTROLS[key].value,
        }), {}),
      },
      points: {},
    }
    this.resizeMap = this.resizeMap.bind(this);
  }

  componentDidMount() {
    window.addEventListener('resize', this.resizeMap);
    this.resizeMap();
    this.getData();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeMap);
  }

  onWindowChange(viewport) {
    const { width, height } = viewport;
    this.setState({
      viewport: {...this.state.viewport, ...viewport},
    });
  }

  getData() {
    axios.get('/api/coordinates')
      .then((res) => {
        // console.log(res.data);
        this.setState({
          points: res.data,
        });
      });
  }

  resizeMap() {
    this.onWindowChange({
      width: document.getElementById('map-container').getBoundingClientRect().width,
      height: document.getElementById('map-container').getBoundingClientRect().height,
    });
  }

  updateLayerSettings(settings) {
    this.setState({ settings });
  }

  render() {
    return (
      <div>
        <MapGL
          {...this.state.viewport}
          mapStyle={MAPBOX_STYLE}
          onViewportChange={viewport => this.onWindowChange(viewport)}
          mapboxApiAccessToken={MAPBOX_TOKEN}
        >
          <DeckGLOverlay
            viewport={this.state.viewport}
            data={this.state.points}
            onHover={hover => this.onHover(hover)}
            {...this.state.settings}
          />
          {/* <LayerControls
          settings={this.state.settings}
          propTypes={HEXAGON_CONTROLS}
          onChange={settings => this.updateLayerSettings(settings)}
        /> */}
        </MapGL>
      </div>
    );
  }
}