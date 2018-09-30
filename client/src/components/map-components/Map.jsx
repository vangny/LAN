import React, { Component } from 'react';
import MapGL from 'react-map-gl';
import { LayerControls, HEXAGON_CONTROLS, SCATTERPLOT_CONTROLS } from './LayerControls.jsx';
import DeckGLOverlay from './DeckGLOverlay';
import sample from '../../../../sampleData';

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
        ...Object.keys(SCATTERPLOT_CONTROLS).reduce((accu, key) => ({
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
    this.getData();
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

  updateLayerSettings(settings) {
    this.setState({settings});
  }

  getData() {
    const points = sample;
    console.log(points);
  }

  render() {
    return (
      <div>
        {/* <LayerControls
          setting={this.state.settings}
          propTypes={HEXAGON_CONTROLS}
          onChange={settings => this.updateLayerSettings(settings)}
        /> */}
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
        </MapGL>
      </div>
    );
  }
}