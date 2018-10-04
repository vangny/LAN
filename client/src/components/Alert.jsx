import React, { Component } from 'react';
import axios from 'axios';
import Dropzone from 'react-dropzone';
import { navigate } from '@reach/router';
import AlertCamera from './alert-components/Camera.jsx';
import Modal from './alert-components/modal.jsx';

class Alert extends Component {
  constructor(props) {
    super(props);
    this.state = {
      photo: '',
      photoTag: '',
      notes: '',
      modal: '',
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.waitForData = this.waitForData.bind(this);
    this.handleDrop = this.handleDrop.bind(this);
  }

  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value,
    });
  }

  /* eslint-disable */
    handleDrop(files) {
        const { photoTag } = this.state;
        const upload = files.map((file) => {
          let formData = new FormData();
          formData.append('file', file);
          formData.append('tags', `${photoTag}`);
          formData.append('upload_preset', 'pnqbmmuw'); // cloud name
          formData.append('api_key', '491544247472459') // api key
          formData.append('timestamp', (Date.now() / 1000) | 0);
              // Cloudinary upload request
          return axios.post('https://api.cloudinary.com/v1_1/n3/image/upload', formData, {
            headers: { "X-Requested-With": "XMLHttpRequest" },
            
          }).then((res) => {
            const { photo } = this.state;
            const data = res.data;
            const photoURL = data.secure_url;

            this.setState({
                photo: `${photoURL}`,
            }, () => {
                console.log('photo url updated', photo);
            })
            console.log(data);
          })
        });
          // After all files uploaded
          axios.all(upload).then(() => {
              console.log('All photos successfully uploaded');
          });
      }
      /* eslint-enable */

  handleSubmit() {
    const {
      category,
      EventId,
      latitude,
      longitude,
      sendAlertsToApp,
    } = this.props;
    const { notes, photo, photoTag } = this.state;
    const alertData = {
      category,
      EventId,
      latitude,
      longitude,
      notes,
      photo,
      photoTag,
    };
    axios.post('/api/alerts', alertData)
      .then((res) => {
        sendAlertsToApp(res.data);
        console.log('alert sent', alertData);
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

  changeModal(view) {
    this.setState({
      modal: view,
    });
  }

  renderModal() {
    if (this.state.modal === "camera") {
      return (
        <Modal>
          <div className="modal-container">
            <AlertCamera
              changeModal={this.changeModal.bind(this)}
            />
            <button type="button" onClick={() => this.changeModal('')}>Exit camera mode</button>
          </div>
        </Modal>
      );
    }
  }

  render() {
    const { notes, photoTag } = this.state;
    const { category } = this.props;
    // console.log(`category: ${category}\nlatitude: ${latitude}\nlongitude: ${longitude}`);
    return (
      <div className="alert-layout">
        <div className="location-info">
          
          <h1>
            Disaster Type:
            {' '}
            {category.split(/\s+/).map(w => w[0].toUpperCase() + w.slice(1)).join(' ')}
          </h1>
        </div>
        <div className="photo">
        {this.renderModal()}
          <button className="photo-button" type="button" onClick={() => this.changeModal('camera')}>Capture Photo</button>
          <input type="text" name="photoTag" placeholder="Add tags for your photos here" onChange={this.handleChange} value={photoTag} />
        </div>
        <div className="notes">
          <input size="" type="text" name="notes" placeholder="Enter text here" onChange={this.handleChange} value={notes} />
        </div>
        <Dropzone
          className="dropzone"
          name="file"
          type="file"
          onDrop={this.handleDrop}
          multiple
          accept="image/*"
        >
          <p>Drop files or click here to upload</p>
        </Dropzone>
        <div className="submit">
          {this.waitForData()}
        </div>
      </div>

    );
  }
}

export default Alert;
