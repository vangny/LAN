import React, { Component } from 'react';
import MapGL from 'react-map-gl';
import axios from 'axios';

import { LayerControls, HEXAGON_CONTROLS, SCATTERPLOT_CONTROLS } from './LayerControls.jsx';
import DeckGLOverlay from './DeckGLOverlay';

const MAPBOX_STYLE = 'mapbox://styles/mapbox/dark-v9';

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

  componentWillMount() {
    this.getData();
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
      viewport: {...this.state.viewport, ...viewport},
    });
  }

  getData() {
    const query = `
    {
      getCoords {
        latitude
        longitude
      }
    }`;
    fetch('/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ query }),
    })
      .then(response => response.json())
      .then((coordinates) => {
        this.setState({
          points: coordinates.data.getCoords,
        });
      });
  }

  resizeMap() {
    if (window.innerWidth >= 1200) {
      this.onWindowChange({
        width: document.getElementById('map-container').getBoundingClientRect().width,
        height: document.getElementById('map-container').getBoundingClientRect().height,
      });
    } else {
      this.onWindowChange({
        width: document.getElementById('content').getBoundingClientRect().width,
        height: document.getElementById('content').getBoundingClientRect().height,
      });
    }
  }

  updateLayerSettings(settings) {
    this.setState({ settings });
  }

  render() {
    const {
      viewport,
      points,
      settings,
    } = this.state;

    const { mapBoxToken } = this.props;

    return (
      <div>
        <MapGL
          {...viewport}
          mapStyle={MAPBOX_STYLE}
          onViewportChange={view => this.onWindowChange(view)}
          mapboxApiAccessToken={mapBoxToken}
        >
          <DeckGLOverlay
            viewport={viewport}
            data={points}
            onHover={hover => this.onHover(hover)}
            {...settings}
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