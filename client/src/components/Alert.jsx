import React, { Component } from 'react';
import axios from 'axios';
import { navigate } from '@reach/router';
// import Camera from './alert-components/TakePhoto.jsx';

class Alert extends Component {
  constructor(props) {
    super(props);
    this.state = {
      photo: 'http://www.publicadjustersassociates.com/images/tornado-damages.jpg',
      photoTag: '',
      notes: '',
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.waitForData = this.waitForData.bind(this);
  }

  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value,
    });
  }

  takePhoto() {
    this.setState({
      photo: 'http://www.publicadjustersassociates.com/images/tornado-damages.jpg',
    });
  }

  fileHandler(e) {
    this.setState({
      photo: e.target.files[0],
    });
  }

  handleSubmit() {
    const {
      latitude,
      longitude,
      EventId,
      category,
      sendAlertsToApp,
    } = this.props;
    const { notes, photo, photoTag } = this.state;
    const alertData = {
      EventId,
      category,
      latitude,
      longitude,
      notes,
      photo,
      photoTag,
    };
    axios.post('/alert/api/alerts', alertData)
      .then((res) => {
        // console.log('alert sent to server', alertData);
        console.log('Alerts returned from the db: ', res.data);
        sendAlertsToApp(res.data);
      })
      .catch((err) => { console.log(err); });
  }

  waitForData() {
    const { latitude } = this.props;
    return latitude !== 'Loading...' ? (
      <button type="button" onClick={this.handleSubmit}>Submit</button>
    ) : (
      <p>
        Still grabbing your location... Please wait
      </p>
    );
  }

  render() {
    const { notes, photoTag } = this.state;
    const { category } = this.props;
    // console.log(`category: ${category}\nlatitude: ${latitude}\nlongitude: ${longitude}`);
    return (
      <div className="container">
        <div className="head" />
        <div className="location-info">
          <h1>
            Disaster Type:
            {' '}
            {category.split(/\s+/).map(w => w[0].toUpperCase() + w.slice(1)).join(' ')}
          </h1>
        </div>
        <div className="photo">
          <button type="button" onClick={this.takePhoto}>Capture Photo</button>
          <input type="text" name="photoTag" placeholder="Describe your photo" onChange={this.handleChange} value={photoTag} />
          <input type="file" onChange={this.fileHandler} />
        </div>
        <div className="notes">
          <input size="" type="text" name="notes" placeholder="Enter text here" onChange={this.handleChange} value={notes} />
        </div>
        <div className="submit">
          {this.waitForData()}
        </div>
      </div>
    );
  }
}

export default Alert;
