import React from 'react';

class AlertOptions extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      categoryClicked: '',
      isClicked: false,
    };
  }


 

// ({ latitude, longitude, appContext, handleAlertOptions }) => {

  componentDidMount() {
    const { appContext } = this.props;
    navigator.geolocation.watchPosition((position) => {
      appContext.setState({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
    });
  }

  clickHandler(e) {
    this.setState({
      categoryClicked: e.currentTarget.value,
      isClicked: true,
    });
  }

  renderConfirmationHandler() {
    const { isClicked, categoryClicked } = this.state;
    const { handleAlertOptions } = this.props;
    return isClicked
      ? (
        <div className="confirmation-button-container">
          <span className="confirmation-prompt">
            {`Click to confirm ${categoryClicked.toUpperCase()} alert`}
          </span>
          <button
            type="button"
            className="category-confirmation"
            onClick={() => {
              handleAlertOptions(categoryClicked);
              this.setState({
                isClicked: false,
                categoryClicked: '',
              });
            }}
          >
          Confirm
          </button>
        </div>
      ) : null;
  }

  render() {
    const { latitude, longitude } = this.props;
    const { categoryClicked } = this.state;
    return (
      <div className="alert-options-container">
        <div className="lat-long-container">
          Current coordinates:
          <br />
          {`${latitude}, ${longitude}`}
        </div>
        <div className="category-header">
          <span className="header-text">{categoryClicked}</span>
        </div>
        <div className="category-buttons-container">

          <button id="hurricane-button" className="category-button" type="button" value="Hurricane" onClick={e => this.clickHandler(e)} />

          <button id="flood-button" className="category-button" type="button" value="Flood" onClick={e => this.clickHandler(e)} />

          <button id="forest-fire-button" className="category-button" type="button" value="Forest Fire" onClick={e => this.clickHandler(e)} />

          <button id="house-fire-button" className="category-button" type="button" value="House Fire" onClick={e => this.clickHandler(e)} />

          <button id="earthquake-button" className="category-button" type="button" value="Earthquake" onClick={e => this.clickHandler(e)} />

          <button id="landslide-button" className="category-button" type="button" value="Landslide" onClick={e => this.clickHandler(e)} />

          <button id="traffic-accident-button" className="category-button" type="button" value="Traffic Accident" onClick={e => this.clickHandler(e)} />

          <button id="volcano-eruption-button" className="category-button" type="button" value="Volcano Eruption" onClick={e => this.clickHandler(e)} />

          <button id="tsunami-button" className="category-button" type="button" value="Tsunami" onClick={e => this.clickHandler(e)} />

          <button id="thief-button" className="category-button" type="button" value="Criminal Activity" onClick={e => this.clickHandler(e)} />

          <button id="toxic-button" className="category-button" type="button" value="Toxic Waste" onClick={e => this.clickHandler(e)} />

          <button id="blizzard-button" className="category-button" type="button" value="Blizzard" onClick={e => this.clickHandler(e)} />
        </div>
        {this.renderConfirmationHandler()}
      </div>
    );
  }
}
export default AlertOptions;
