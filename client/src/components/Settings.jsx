import React, { Component } from 'react';

export default class Settings extends Component {
  constructor(props) {
    super(props);
    const { currentRange } = this.props;
    this.state = {
      filter: 'none',
      range: currentRange,
    };

    this.setOption = this.setOption.bind(this);
  }

  setOption(option, value) {
    this.setState({
      [option]: value,
    });
  }


  render() {
    const { handleSettings, changeSettings } = this.props;
    const { filter, range } = this.state;
    return (
      <div className="options-modal-container">
        <div className="options-container">
          <div className="options">
            <div className="range-container">
              <input
                type="range"
                min="0"
                max="1000"
                value={range}
                step="10"
                onChange={event => this.setOption('range', event.target.value)}
                className="range"
              />
            </div>
            <div className="filter-container">
              <select
                className="filter"
                onChange={event => this.setOption('filter', event.target.value)}
              >
                <option value="none">None</option>
                <option value="earthquake">Earthquakes</option>
                <option value="flood">Floods</option>
                <option value="hurricane">Hurricanes</option>
                <option value="wildfire">Wildfires</option>
              </select>
            </div>
            <div className="settings-buttons">
              <div className="exit-button">
                <button type="button" onClick={() => handleSettings()}>
                  <i className="fas fa-times" />
                  <span>&nbsp;&nbsp;Exit Settings</span>
                </button>
              </div>
              <div className="change-button">
                <button type="button" onClick={() => changeSettings(filter, range)}>
                  <i className="fas fa-check" />
                  <span>&nbsp;&nbsp;Change Settings</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
