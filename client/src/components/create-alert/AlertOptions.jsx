import React from 'react';

class AlertOptions extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      categoryClicked: null,
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
    console.log('renderConfirmationHandler: ', categoryClicked);
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
                categoryClicked: null,
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
    return latitude !== 'Loading...'
      ? (
        <div className="alert-options-container">
          <div className="lat-long-container">
            Current coordinates:
            <br />
            {`${latitude}, ${longitude}`}
          </div>
          <div className="category-buttons-container">
  
            <button id="hurricane-button" className="category-button" type="button" value="Hurricane" onClick={e => this.clickHandler(e)}>{/*<img className="cat-icon" src={require('../../../button-icons/013-hurricane.png')} value="hurricane" alt="hurricane" />*/}
            <div className="button-content"></div>
            </button>
  
            <button id="flood-button" className="category-button" type="button" value="Flood" onClick={e => this.clickHandler(e)}>{/*<img className="cat-icon" src={require('../../../button-icons/016-flood.png')} alt="flood" />*/}</button>
  
            <button id="forest-fire-button" className="category-button" type="button" value="Forest Fire" onClick={e => this.clickHandler(e)}>{/*<img className="cat-icon" src={require('../../../button-icons/015-fire.png')} alt="forest fire" />*/}</button>
  
            <button id="house-fire-button" className="category-button" type="button" value="House Fire" onClick={e => this.clickHandler(e)}>{/*<img className="cat-icon" src={require('../../../button-icons/014-house.png')} alt="forest fire" />*/}</button>
  
            <button id="earthquake-button" className="category-button" type="button" value="Earthquake" onClick={e => this.clickHandler(e)}>{/*<img className="cat-icon" src={require('../../../button-icons/018-earthquake.png')} alt="earthquake" />*/}</button>
  
            <button id="landslide-button" className="category-button" type="button" value="Landslide" onClick={e => this.clickHandler(e)}>{/*<img className="cat-icon" src={require('../../../button-icons/006-landslide-2.png')} alt="landslide" />*/}</button>
  
            <button id="traffic-accident-button" className="category-button" type="button" value="Traffic Accident" onClick={e => this.clickHandler(e)}>{/*<img className="cat-icon" src={require('../../../button-icons/car-collision (1).png')} alt="traffic-accident" />*/}</button>
  
            <button id="volcano-eruption-button" className="category-button" type="button" value="Volcano Eruption" onClick={e => this.clickHandler(e)}>{/*<img className="cat-icon" src={require('../../../button-icons/002-volcano.png')} alt="volcano-eruption" />*/}</button>
  
            <button id="tsunami-button" className="category-button" type="button" value="Tsunami" onClick={e => this.clickHandler(e)}>{/*<img className="cat-icon" src={require('../../../button-icons/003-tsunami.png')} alt="tsunami" />*/}</button>
  
            <button id="thief-button" className="category-button" type="button" value="Criminal Activity" onClick={e => this.clickHandler(e)}>{/*<img className="cat-icon" src={require('../../../button-icons/thief.png')} alt="thief" />*/}</button>
  
            <button id="toxic-button" className="category-button" type="button" value="Toxic Waste" onClick={e => this.clickHandler(e)}>{/*<img className="cat-icon" src={require('../../../button-icons/004-waste.png')} alt="toxic waste" />*/}</button>
  
            <button id="blizzard-button" className="category-button" type="button" value="Blizzard" onClick={e => this.clickHandler(e)}>{/*<img className="cat-icon" src={require('../../../button-icons/blizzard.png')} alt="blizzard" />*/}</button>
  
          </div>
            {this.renderConfirmationHandler()}
        </div>
      ) : (
        <p>
          Still grabbing your location... Please wait
        </p>
      );
  }
}
export default AlertOptions;
