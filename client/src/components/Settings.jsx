import React, { Component } from 'react';

export default class Settings extends Component {
  constructor(props) {
    super(props);
    const { currentRange } = this.props;
    this.state = {
      filter: '',
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
              <span className="range-value">{`Range: ${range}`}</span>
              <input
                type="range"
                min="0"
                max="1000"
                value={range}
                step="10"
                onChange={event => this.setOption('range', event.target.value)}
                className="range-slider"
              />
            </div>
            <div className="filter-container">
              <span className="filter-value">{`Category: ${filter}`}</span>
              <form
                className="filter-radio"
                onChange={event => this.setOption('filter', event.target.value)}
              >
                <div>
                  <input type="radio" id="none-button" name="radio-category" value="None" defaultChecked/>
                  <label htmlFor="none-button">None</label>
                </div>
                <div>
                  <input type="radio" id="blizzard-button" name="radio-category" value="Blizzard" />
                  <label htmlFor="blizzard-button">Blizzard</label>
                </div>
                <div>
                  <input type="radio" id="criminal-button" name="radio-category" value="Criminal Activity" />
                  <label htmlFor="criminal-button">Criminal Activity</label>
                </div>
                <div>
                  <input type="radio" id="earthquake-button" name="radio-category" value="Earthquake" />
                  <label htmlFor="earthquake-button">Earthquakes</label>
                </div>
                <div>
                  <input type="radio" id="flood-button" name="radio-category" value="Flood" />
                  <label htmlFor="flood-button">Floods</label>
                </div>
                <div>
                  <input type="radio" id="wildfire-button" name="radio-category" value="House Fire" />
                  <label htmlFor="wildfire-button">Wildfires</label>
                </div>
                <div>
                  <input type="radio" id="house-fire-button" name="radio-category" value="House Fire" />
                  <label htmlFor="house-fire-button">House Fire</label>
                </div>
                <div>
                  <input type="radio" id="hurricane-button" name="radio-category" value="Hurricane" />
                  <label htmlFor="hurricane-button">Hurricanes</label>
                </div>
                <div>
                  <input type="radio" id="landslide-button" name="radio-category" value="Landslide" />
                  <label htmlFor="landslide-button">Landslide</label>
                </div>
                <div>
                  <input type="radio" id="toxic-button" name="radio-category" value="Toxic Waste" />
                  <label htmlFor="toxic-button">Toxic Waste</label>
                </div>
                <div>
                  <input type="radio" id="tsunami-button" name="radio-category" value="Tsunami" />
                  <label htmlFor="tsunami-button">Tsunami</label>
                </div>
                <div>
                  <input type="radio" id="traffic-button" name="radio-category" value="Traffic Accident" />
                  <label htmlFor="traffic-button">Traffic Accident</label>
                </div>
                <div>
                  <input type="radio" id="volcano-button" name="radio-category" value="Volcano Eruption" />
                  <label htmlFor="volcano-button">Volcano Eruption</label>
                </div>
              </form>
            </div>
            <div className="settings-buttons">
              <div className="exit-container">
                <div className="exit-button">
                  <button type="button" onClick={() => handleSettings()}>
                    <i className="fas fa-times" />
                    <span>&nbsp;&nbsp;Cancel</span>
                  </button>
                </div>
              </div>
              <div className="change-container">
                <div className="change-button">
                  <button type="button" onClick={() => changeSettings(filter, range)}>
                    <i className="fas fa-check" />
                    <span>&nbsp;&nbsp;Filter</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
