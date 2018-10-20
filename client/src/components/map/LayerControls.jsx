import React, { Component } from 'react';

export const HEXAGON_CONTROLS = {
  showHexagon: {
    displayName: 'Show Hexagon',
    type: 'boolean',
    value: true,
  },
  radius: {
    displayName: 'Hexagon Radius',
    type: 'range',
    value: 50,
    step: 10,
    min: 50,
    max: 500
  },
  coverage: {
    displayName: 'Hexagon Coverage',
    type: 'range',
    value: 0.7,
    step: 0.1,
    min: 0,
    max: 1,
  },
  upperPercentile: {
    displayName: 'Hexagon Upper Percentile',
    type: 'range',
    value: 100,
    step: 0.1,
    min: 80,
    max: 100,
  },
  radiusScale: {
    displayName: 'Scatterplot Radius',
    type: 'range',
    value: 30,
    step: 10,
    min: 10,
    max: 200,
  },
};

export const SCATTERPLOT_CONTROLS = {
  radiusScale: {
    displayName: 'Scatterplot Radius',
    type: 'range',
    value: 30,
    step: 10,
    min: 10,
    max: 200,
  },
}

const Setting = props => {
  const { propType } = props;

  if (propType && propType.type) {
    switch (propType.type) {
      case 'range':
        return <Slider {...props} />;
      case 'boolean':
        return <Checkbox {...props} />;
      default:
      return <input {...props} />;
    }
  }
};

const Checkbox = ({ settingName, value, onChange }) => {
  return (
    <div key={settingName}>
      <div className='input-group'>
        <input
          type='checkbox'
          id={settingName}
          checked={value}
          onChange={e => onChange(settingName, e.target.checked)}
        />
      </div>
    </div>
  );
};

const Slider = ({ settingName, value, propType, onChange }) => {
  const { max = 100 } = propType;

  return (
    <div key={settingName}>
      <div className='input-group'>
        <div>
          <input
            type='range'
            id={settingName}
            min={0}
            max={max}
            step={max / 100}
            value={value}
            onChange={e => onChange(settingName, Number(e.target.value))}
          />
        </div>
      </div>
    </div>
  );
};

export class LayerControls extends Component {
  constructor(props) {
    super(props);
    this.onValueChange = this.onValueChange.bind(this);
  }

  onValueChange(settingName, newValue) {
    const { settings, onChange } = this.props;
    if (settings[settingName] !== newValue) {
      const newSettings = {
        ...this.props.settings,
        [settingName]: newValue,
      };
      onChange(newSettings);
    }
  }

  render() {
    const { title, settings, propTypes = {} } = this.props;
    return (
      <div className='layer-controls'>
        {title && <h4>{title}</h4>}
        {Object.keys(settings).map(key =>
          <div key={key}>
            <label>{propTypes[key].displayName}</label>
            <div style={{display: 'inline-block', float: 'right'}}>
              {settings[key]}</div>
            <Setting
              settingName={key}
              value={settings[key]}
              propType={propTypes[key]}
              onChange={this.onValueChange}
              />
          </div>)}
      </div>
    );
  }
}

